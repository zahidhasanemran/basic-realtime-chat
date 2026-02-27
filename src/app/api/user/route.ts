export const GET = async (req: Request) => {
  return new Response(JSON.stringify({user: {name: "John"}}));
}