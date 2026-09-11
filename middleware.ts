import {NextResponse} from 'next/server';
// The PRD's shared demo intentionally has no authentication gate.
export function middleware(){return NextResponse.next();}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
