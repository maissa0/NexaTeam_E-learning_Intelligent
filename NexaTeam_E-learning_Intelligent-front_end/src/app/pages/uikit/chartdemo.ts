import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../layout/service/layout.service';

@Component({
    selector: 'app-chart-demo',
    standalone: true,
    imports: [CommonModule, ChartModule, FluidModule],
    template: `
       
       <p-fluid class="grid grid-cols-12 gap-8">
            <div class="col-span-12 xl:col-span-6">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Average score per Course</div>
                    <p-chart type="bar" [data]="categoryScoresData" [options]="categoryScoresOptions"></p-chart>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Responses Correctes vs Incorrectes</div>
                    <p-chart type="pie" [data]="correctIncorrectData" [options]="correctIncorrectOptions"></p-chart>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-6">
                <div class="card flex flex-col items-center">
                    <div class="font-semibold text-xl mb-4">Répartition des Temps de Réponse</div>
                    <p-chart type="line" [data]="responseTimeData" [options]="responseTimeOptions"></p-chart>
                </div>
            </div>
        </p-fluid>
    `
})
export class ChartDemo {
    categoryScoresData: any;
    correctIncorrectData: any;
    responseTimeData: any;

    // Options pour les graphiques
    categoryScoresOptions: any;
    correctIncorrectOptions: any;
    responseTimeOptions: any;

    subscription: Subscription;

    constructor(private layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initCharts();
        });
    }

    ngOnInit() {
        this.initCharts();
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Données pour le graphique "Score moyen par catégorie"
        this.categoryScoresData = {
            labels: ['Angular', 'Python', 'Java', 'Finance'],
            datasets: [
                {
                    label: 'Score moyen (%)',
                    backgroundColor: documentStyle.getPropertyValue('--p-indigo-500'),
                    borderColor: documentStyle.getPropertyValue('--p-indigo-500'),
                    data: [80, 65, 90, 75]
                }
            ]
        };

        this.categoryScoresOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        // Données pour le graphique "Réponses Correctes vs Incorrectes"
        this.correctIncorrectData = {
            labels: ['Correctes', 'Incorrectes'],
            datasets: [
                {
                    data: [65, 35],
                    backgroundColor: [documentStyle.getPropertyValue('--p-green-500'), documentStyle.getPropertyValue('--p-red-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-green-400'), documentStyle.getPropertyValue('--p-red-400')]
                }
            ]
        };

        this.correctIncorrectOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };

        // Données pour le graphique "Répartition des Temps de Réponse"
        this.responseTimeData = {
            labels: ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5'],
            datasets: [
                {
                    label: 'Temps de réponse (secondes)',
                    data: [12, 15, 10, 20, 8],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--p-teal-500'),
                    borderColor: documentStyle.getPropertyValue('--p-teal-500'),
                    tension: 0.4
                }
            ]
        };

        this.responseTimeOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
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
