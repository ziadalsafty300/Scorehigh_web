import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { fullName, email, grade, targetTest, currentScore, message } = req.body;

      // Send the email to the tutor
      const { data, error } = await resend.emails.send({
        from: 'ScoreHigh Forms <onboarding@resend.dev>', // Replace with your verified domain email later
        to: 'ziadsafty76@gmail.com',
        subject: `New Consultation Request: ${fullName}`,
        html: `
          <h3>New Consultation Request</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Grade:</strong> ${grade}</p>
          <p><strong>Program Interest:</strong> ${targetTest}</p>
          <p><strong>Current Score:</strong> ${currentScore || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
