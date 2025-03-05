import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { JobofferService } from '../Services/joboffer.service';

@Component({
    standalone: true,
    selector: 'app-job-offers-stats',
    imports: [ChartModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Job Offers Statistics</div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class JobOffersStatsComponent {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    constructor(
        private jobOfferService: JobofferService
    ) {}

    ngOnInit() {
        this.loadJobOffersStats();
    }

    loadJobOffersStats() {
        this.jobOfferService.getAllJobOffers().subscribe(offers => {
            const stats = {
                'FULL_TIME': { count: 0, views: 0 },
                'PART_TIME': { count: 0, views: 0 },
                'INTERNSHIP': { count: 0, views: 0 },
                'FREELANCE': { count: 0, views: 0 }
            };

            offers.forEach(offer => {
                if (stats[offer.contractType]) {
                    stats[offer.contractType].count++;
                    // Using optional chaining for viewCount
                    stats[offer.contractType].views += offer?.viewCount ?? 0;
                }
            });

            this.initChart(stats);
        });
    }

    initChart(stats: any) {
        const documentStyle = getComputedStyle(document.documentElement);

        this.chartData = {
            labels: ['Full Time', 'Part Time', 'Internship', 'Freelance'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Number of Offers',
                    backgroundColor: '#2196F3',
                    data: [
                        stats.FULL_TIME.count,
                        stats.PART_TIME.count,
                        stats.INTERNSHIP.count,
                        stats.FREELANCE.count
                    ],
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: 'Total Views',
                    backgroundColor: '#4CAF50',
                    data: [
                        stats.FULL_TIME.views,
                        stats.PART_TIME.views,
                        stats.INTERNSHIP.views,
                        stats.FREELANCE.views
                    ],
                    borderRadius: {
                        topLeft: 8,
                        topRight: 8,
                        bottomLeft: 0,
                        bottomRight: 0
                    },
                    borderSkipped: false,
                    barThickness: 32
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y;
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#6c757d'
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: '#6c757d'
                    },
                    grid: {
                        color: '#e9ecef',
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}