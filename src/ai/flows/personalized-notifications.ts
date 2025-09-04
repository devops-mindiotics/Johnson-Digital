// src/ai/flows/personalized-notifications.ts
'use server';

/**
 * @fileOverview Generates personalized in-app notifications based on user role.
 *
 * - generateNotification - A function that generates a personalized notification.
 * - NotificationInput - The input type for the generateNotification function.
 * - NotificationOutput - The return type for the generateNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NotificationInputSchema = z.object({
  userRole: z
    .string()
    .describe(
      'The role of the user (e.g., Super Admin, School Admin, Teacher, Student).'
    ),
  userName: z.string().describe('The name of the user.'),
  taskType: z
    .string()
    .optional()
    .describe(
      'Type of task that triggers notification such as homework, notice board, etc.'
    ),
  infoType: z
    .string()
    .optional()
    .describe('Type of information that needs to be in the notification.'),
});
export type NotificationInput = z.infer<typeof NotificationInputSchema>;

const NotificationOutputSchema = z.object({
  notificationTitle: z.string().describe('The title of the notification.'),
  notificationBody: z.string().describe('The body of the notification.'),
});
export type NotificationOutput = z.infer<typeof NotificationOutputSchema>;

export async function generateNotification(
  input: NotificationInput
): Promise<NotificationOutput> {
  return generateNotificationFlow(input);
}

const notificationPrompt = ai.definePrompt({
  name: 'notificationPrompt',
  input: {schema: NotificationInputSchema},
  output: {schema: NotificationOutputSchema},
  prompt: `You are an AI assistant that generates personalized in-app notifications for an educational platform called EduCentral.

  Based on the user's role ({{{userRole}}}), their name ({{{userName}}}), the type of task ({{{taskType}}}), and type of information ({{{infoType}}}), create a concise and informative notification.

  The notification should have a title (notificationTitle) and a body (notificationBody).

  Example:
  If a student has new homework, the notification could be:
  {
    "notificationTitle": "New Homework",
    "notificationBody": "Dear Student, you have a new homework assignment in Math. Please check the Homework section for details."
  }

  If a teacher has a new notice board message, the notification could be:
  {
    "notificationTitle": "New Notice",
    "notificationBody": "Dear Teacher, a new notice has been posted on the Notice Board. Please check the Notice Board section for details."
  }

  Now, generate a notification for the following:
  User Role: {{{userRole}}}
  User Name: {{{userName}}}
  Task Type: {{{taskType}}}
  Info Type: {{{infoType}}}
  `,
});

const generateNotificationFlow = ai.defineFlow(
  {
    name: 'generateNotificationFlow',
    inputSchema: NotificationInputSchema,
    outputSchema: NotificationOutputSchema,
  },
  async input => {
    const {output} = await notificationPrompt(input);
    return output!;
  }
);
