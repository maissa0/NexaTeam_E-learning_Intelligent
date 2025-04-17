import { Component } from '@angular/core';

@Component({
    selector: 'features-widget',
    standalone: true,
    template: `
        <div id="features" class="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
            <div class="text-center">
                <h2 class="text-900 font-normal mb-2">Powerful HR Features</h2>
                <span class="text-600 text-2xl">Everything you need to streamline your recruitment process</span>
            </div>

            <div class="grid justify-content-center mt-8 md:mt-10">
                <div class="col-12 lg:col-4 p-0 md:p-3">
                    <div class="p-3 flex flex-column border-round bg-white h-full" style="border: 2px solid var(--surface-border)">
                        <h3 class="text-2xl font-medium text-900 mb-3">Job Posting Management</h3>
                        <div class="text-700 mb-3 line-height-3">
                            Create, edit, and manage job postings with ease. Track applications and manage candidate pipelines efficiently.
                        </div>
                        <img src="assets/layout/images/job-posting.svg" alt="Job Posting" class="w-full mt-auto" />
                    </div>
                </div>

                <div class="col-12 lg:col-4 p-0 md:p-3">
                    <div class="p-3 flex flex-column border-round bg-white h-full" style="border: 2px solid var(--surface-border)">
                        <h3 class="text-2xl font-medium text-900 mb-3">Candidate Management</h3>
                        <div class="text-700 mb-3 line-height-3">
                            Review applications, schedule interviews, and collaborate with your team to make informed hiring decisions.
                        </div>
                        <img src="assets/layout/images/candidate-mgmt.svg" alt="Candidate Management" class="w-full mt-auto" />
                    </div>
                </div>

                <div class="col-12 lg:col-4 p-0 md:p-3">
                    <div class="p-3 flex flex-column border-round bg-white h-full" style="border: 2px solid var(--surface-border)">
                        <h3 class="text-2xl font-medium text-900 mb-3">Analytics & Reporting</h3>
                        <div class="text-700 mb-3 line-height-3">
                            Get insights into your recruitment process with detailed analytics and customizable reports.
                        </div>
                        <img src="assets/layout/images/analytics.svg" alt="Analytics" class="w-full mt-auto" />
                    </div>
                </div>
            </div>
        </div>
    `
})
export class FeaturesWidget {}
