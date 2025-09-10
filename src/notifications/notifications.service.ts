import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    // Verify connection configuration
    try {
      await this.transporter.verify();
      this.logger.log('Email transporter configured successfully');
    } catch (error) {
      this.logger.error('Email transporter configuration failed:', error);
    }
  }

  async sendNewMatchNotification(match: any): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to: 'admin@example.com', // In a real app, this would be the client's email
        subject: `New Vendor Match for Project #${match.project_id}`,
        html: `
          <h2>New Vendor Match Generated</h2>
          <p>A new vendor match has been created for your expansion project.</p>
          <ul>
            <li><strong>Project ID:</strong> ${match.project_id}</li>
            <li><strong>Vendor ID:</strong> ${match.vendor_id}</li>
            <li><strong>Match Score:</strong> ${match.score}</li>
            <li><strong>Created:</strong> ${new Date(match.created_at).toLocaleString()}</li>
          </ul>
          <p>Please review the match and take appropriate action.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`New match notification sent for project ${match.project_id}`);
    } catch (error) {
      this.logger.error('Failed to send new match notification:', error);
    }
  }

  async sendMatchAcceptedNotification(match: any): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to: 'vendor@example.com', // In a real app, this would be the vendor's email
        subject: `Match Accepted for Project #${match.project_id}`,
        html: `
          <h2>Match Accepted</h2>
          <p>Your vendor match has been accepted by the client.</p>
          <ul>
            <li><strong>Project ID:</strong> ${match.project_id}</li>
            <li><strong>Vendor ID:</strong> ${match.vendor_id}</li>
            <li><strong>Match Score:</strong> ${match.score}</li>
            <li><strong>Accepted:</strong> ${new Date(match.accepted_at).toLocaleString()}</li>
            ${match.notes ? `<li><strong>Notes:</strong> ${match.notes}</li>` : ''}
          </ul>
          <p>Please contact the client to proceed with the project.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Match accepted notification sent for project ${match.project_id}`);
    } catch (error) {
      this.logger.error('Failed to send match accepted notification:', error);
    }
  }

  async sendSLAExpiredNotification(vendor: any): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to: vendor.contact_email || 'admin@example.com',
        subject: 'SLA Expired - Action Required',
        html: `
          <h2>SLA Expired</h2>
          <p>Your response SLA has expired. Please take immediate action.</p>
          <ul>
            <li><strong>Vendor:</strong> ${vendor.name}</li>
            <li><strong>SLA Hours:</strong> ${vendor.response_sla_hours}</li>
            <li><strong>Current Rating:</strong> ${vendor.rating}</li>
          </ul>
          <p>Please review your response times and improve your SLA compliance.</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`SLA expired notification sent for vendor ${vendor.id}`);
    } catch (error) {
      this.logger.error('Failed to send SLA expired notification:', error);
    }
  }

  async sendDailyMatchRefreshNotification(projectCount: number, matchCount: number): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to: 'admin@example.com',
        subject: 'Daily Match Refresh Report',
        html: `
          <h2>Daily Match Refresh Report</h2>
          <p>Daily match refresh process has been completed.</p>
          <ul>
            <li><strong>Projects Processed:</strong> ${projectCount}</li>
            <li><strong>Matches Updated:</strong> ${matchCount}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log('Daily match refresh notification sent');
    } catch (error) {
      this.logger.error('Failed to send daily match refresh notification:', error);
    }
  }
}
