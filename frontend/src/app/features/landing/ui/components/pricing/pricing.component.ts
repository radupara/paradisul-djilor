import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface PricingPlan {
  name: string;
  price: number;
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
      name: 'Standard',
      price: 499,
      billingPeriod: 'monthly',
      description: 'Perfect for getting started',
      features: [
        'Professional DJ services (4 hours)',
        'Bose F1 812 sound system',
        'Moving heads lighting system',
        'Setup and pack down included',
        'Background music for dinner',
        'Microphone for speeches'
      ],
      buttonText: 'Subscribe Now',
      isPopular: false
    },
    {
      name: 'PRO',
      price: 799,
      billingPeriod: 'monthly',
      description: 'Complete event solution',
      features: [
        'Professional DJ services (4 hours)',
        'Bose F1 812 sound system',
        'Moving heads lighting system',
        'Setup and pack down included',
        'Background music for dinner',
        'Microphone for speeches',
        'Background music for cocktail hour'
      ],
      extras: [
        'Annual reports included',
        'Priority support'
      ],
      buttonText: 'Subscribe Now',
      isPopular: true
    }
  ];

  onSubscribe(planName: string): void {
    console.log(`Subscribe to ${planName} plan`);
  }
}
