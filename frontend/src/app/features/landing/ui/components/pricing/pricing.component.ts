import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface PricingPlan {
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  extras?: string[];
  isPopular?: boolean;
  buttonText: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  pricingPlans: PricingPlan[] = [
    {
      name: 'landing.pricing.plans.standard.name',
      price: 'landing.pricing.plans.standard.price',
      billingPeriod: 'monthly',
      description: 'landing.pricing.plans.standard.description',
      features: [
        'landing.pricing.plans.standard.features.clientDetails',
        'landing.pricing.plans.standard.features.eventDetails',
        'landing.pricing.plans.standard.features.stopChasing',
        'landing.pricing.plans.standard.features.neverMiss',
        'landing.pricing.plans.standard.features.onePlatform',
        'landing.pricing.plans.standard.features.automateReminders'
      ],
      buttonText: 'landing.pricing.plans.standard.buttonText',
      isPopular: false
    },
    {
      name: 'landing.pricing.plans.pro.name',
      price: 'landing.pricing.plans.pro.price',
      billingPeriod: 'monthly',
      description: 'landing.pricing.plans.pro.description',
      features: [
        'landing.pricing.plans.pro.features.clientDetails',
        'landing.pricing.plans.pro.features.eventDetails',
        'landing.pricing.plans.pro.features.stopChasing',
        'landing.pricing.plans.pro.features.neverMiss',
        'landing.pricing.plans.pro.features.onePlatform',
        'landing.pricing.plans.pro.features.automateReminders'
      ],
      extras: [
        'landing.pricing.plans.pro.extras.annualReport',
        'landing.pricing.plans.pro.extras.getPaidFaster',
        'landing.pricing.plans.pro.extras.clientRequests',
        'landing.pricing.plans.pro.extras.commandCenter',
        'landing.pricing.plans.pro.extras.completeYear'
      ],
      buttonText: 'landing.pricing.plans.pro.buttonText',
      isPopular: true
    }
  ];

  onSubscribe(planName: string): void {
    console.log(`Subscribe to ${planName} plan`);
  }
}
