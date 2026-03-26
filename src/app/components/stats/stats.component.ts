import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  BarChartModule,
  LineChartModule,
  PieChartModule,
} from '@swimlane/ngx-charts';
import { TranslatePipe } from '@ngx-translate/core';
import { loadVerbs } from 'src/app/store/verbs/verbs.actions';
import { selectAllVerbs } from 'src/app/store/verbs/verbs.selectors';
import { selectGameHistory } from 'src/app/store/game/game.selectors';
import { countVerbPatterns } from 'src/app/utils/verb-pattern';
import { SeoService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'app-stats',
  imports: [BarChartModule, PieChartModule, LineChartModule, TranslatePipe],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /** Grid width used to size ngx-charts `[view]` so SVGs never exceed the layout. */
  private readonly chartGrid = viewChild<ElementRef<HTMLElement>>('chartGrid');

  /** Bar + pie: one grid column width (half row on desktop). */
  private readonly columnChartSize = signal<[number, number]>([320, 260]);
  /** Line chart: full grid width (spans both columns). */
  private readonly fullChartSize = signal<[number, number]>([320, 260]);

  readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly history = toSignal(this.store.select(selectGameHistory), {
    initialValue: [],
  });
  readonly verbs = toSignal(this.store.select(selectAllVerbs), {
    initialValue: [],
  });

  /** Bar / pie charts — ngx-charts `[view]`. */
  readonly chartView = computed(() => this.columnChartSize());

  /** Line chart: wider viewport + extra height for axes. */
  readonly lineChartView = computed(() => {
    const [w, h] = this.fullChartSize();
    return [w, h + 40] as [number, number];
  });

  /** ngx-charts built-in color scheme name (see ChartCommonModule). */
  readonly colorScheme = 'vivid' as const;

  constructor() {
    afterNextRender(
      () => {
        if (!isPlatformBrowser(this.platformId)) {
          return;
        }

        let layoutRetries = 0;
        const maxLayoutRetries = 24;

        const horizontalContentPx = (node: HTMLElement | null): number => {
          if (!node) {
            return 0;
          }
          const style = getComputedStyle(node);
          const pl = parseFloat(style.paddingLeft) || 0;
          const pr = parseFloat(style.paddingRight) || 0;
          return Math.max(0, Math.floor(node.clientWidth - pl - pr));
        };

        const applyChartSize = (): void => {
          const grid = this.chartGrid()?.nativeElement;
          if (!grid) {
            return;
          }

          const gridW = Math.floor(grid.getBoundingClientRect().width);

          const columnCard = grid.querySelector(
            '.stats__card:not(.stats__card--wide)',
          ) as HTMLElement | null;
          const wideCard = grid.querySelector(
            '.stats__card--wide',
          ) as HTMLElement | null;

          const colContent = horizontalContentPx(columnCard);
          const fullContent = horizontalContentPx(wideCard);

          const twoCol =
            typeof window !== 'undefined' &&
            window.matchMedia('(min-width: 900px)').matches;
          const gapPx = 32;
          const cardPadX = 40;

          const estimatedColW = twoCol
            ? Math.max(0, Math.floor((gridW - gapPx) / 2) - cardPadX)
            : Math.max(0, gridW - cardPadX);
          const estimatedFullW = Math.max(0, gridW - cardPadX);

          // Lazy route: first frames often report 0 width — retry before accepting mins.
          if (gridW < 80 && layoutRetries < maxLayoutRetries) {
            layoutRetries += 1;
            requestAnimationFrame(() => applyChartSize());
            return;
          }

          const colW = Math.max(
            240,
            Math.min(
              520,
              colContent > 0 ? colContent : estimatedColW,
            ),
          );
          const fullW = Math.max(
            280,
            Math.min(
              900,
              fullContent > 0 ? fullContent : estimatedFullW,
            ),
          );

          this.columnChartSize.set([colW, 260]);
          this.fullChartSize.set([fullW, 260]);
        };

        applyChartSize();

        const grid = this.chartGrid()?.nativeElement;
        if (!grid) {
          return;
        }

        const ro = new ResizeObserver(() => {
          applyChartSize();
        });
        ro.observe(grid);
        this.destroyRef.onDestroy(() => ro.disconnect());
      },
    );
  }

  readonly barResults = computed(() => {
    const h = [...this.history()].reverse();
    return h.map((g, i) => ({
      name: `#${i + 1}`,
      value: g.score,
      extra: { time: g.time, date: g.date },
    }));
  });

  readonly pieResults = computed(() => {
    const counts = countVerbPatterns(this.verbs());
    return (['AAA', 'ABA', 'ABB', 'ABC'] as const).map((key) => ({
      name: key,
      value: counts[key],
    }));
  });

  /** Cumulative games finished over time (chronological). */
  readonly lineResults = computed(() => {
    const h = [...this.history()].reverse();
    let cumulative = 0;
    const series = h.map((g) => {
      cumulative += 1;
      return {
        name: new Date(g.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
        value: cumulative,
      };
    });
    return [
      {
        name: 'Games',
        series,
      },
    ];
  });

  readonly hasLineData = computed(
    () => (this.lineResults()[0]?.series?.length ?? 0) > 0,
  );

  ngOnInit(): void {
    this.seoService.updateStatsPageSEO();
    this.store.dispatch(loadVerbs());
  }
}
