import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// export async function GET(req: NextApiRequest, res: NextApiResponse  ) {
//   return NextResponse.json({ message: 'Hello!' })
// }

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body;

  if (req.method === 'POST') {
    try {
      const response = await axios.post(
        'https://api.speechace.co/api/scoring/text/v0.1/json',
        {
          text: text,
          dialect: 'en_us',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SPEECHACE_API_KEY}`,
          },
        }
      );

      return NextResponse.json(response.data); // Return response here
    } catch (error) {
      console.error('Error fetching pronunciation feedback:', error);
      // Return a NextResponse with an error message
      return NextResponse.json({ error: 'Error fetching pronunciation feedback' }, { status: 500 }); 
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
