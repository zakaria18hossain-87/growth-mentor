'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="panel empty"><h1>Could not load your workspace.</h1><p>Your saved data has not been changed. Check your connection and try again.</p><button className="button primary" onClick={reset}>Retry</button></section>}
