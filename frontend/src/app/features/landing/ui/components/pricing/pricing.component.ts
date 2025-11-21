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
      price: 10,
      billingPeriod: 'monthly',
      description: 'Essential client management',
      features: [
        'Client Details at Your Fingertips. Always',
        'Event Details, Timeline, Reminders—All Synced',
        'Stop Chasing Clients for Information',
        'Never Miss a Client Detail Again',
        'One Platform. All Your Client Needs',
        'Automate Reminders. Book More Events'
      ],
      buttonText: 'Subscribe Now',
      isPopular: false
    },
    {
      name: 'PRO',
      price: 20,
      billingPeriod: 'monthly',
      description: 'Complete command center for DJs',
      features: [
        'Client Details at Your Fingertips. Always',
        'Event Details, Timeline, Reminders—All Synced',
        'Stop Chasing Clients for Information',
        'Never Miss a Client Detail Again',
        'One Platform. All Your Client Needs',
        'Automate Reminders. Book More Events'
      ],
      extras: [
        'Your Annual DJ Report Card—Built Automatically',
        'Get Paid Faster. Organize Smarter',
        'Client Requests. Automated Follow-Ups. Zero Dropped Balls',
        'The Command Center Every DJ Needs',
        'Your Complete DJ Year: Tracked, Organized, Optimized'
      ],
      buttonText: 'Subscribe Now',
      isPopular: true
    }
  ];

  onSubscribe(planName: string): void {
    console.log(`Subscribe to ${planName} plan`);
  }
}
