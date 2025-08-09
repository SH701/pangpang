import { NextRequest,NextResponse } from "next/server";

export async function GET(req:NextRequest){
      try {
        const token = req.headers.get('authorization');
        if (!token) {
          return NextResponse.json(
            { error: 'Authorization token is missing' },
            { status: 401 }
          );
        }

    const backendRes = await fetch(
     `${process.env.API_URL}/api/personas/my`,
      {
        method: 'GET',
        headers: { Authorization: token },
      } 
    );
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}