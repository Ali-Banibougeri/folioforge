import { createClient } from "npm:@supabase/supabase-js@2";

const SITE_ORIGIN = (Deno.env.get("ARCADE_SITE_ORIGIN") || "http://localhost:8000").replace(/\/$/, "");
const ALLOWED_ORIGINS = new Set([
  SITE_ORIGIN,
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);
const GAMES = new Set(["snake", "tetris", "breakout", "pacman"]);
const PAGES = new Set(["home", "arcade"]);
const TRACE_ALPHABET = "0123456789abcdefghijklmnopqrstuv";
const MAX_TRACE = 20000;
const SESSION_MAX_AGE_MS = 20 * 60 * 1000;
const TICK_MS: Record<string, number> = { snake: 115, tetris: 80, breakout: 40, pacman: 120 };

const supabaseUrl = (Deno.env.get("SUPABASE_URL") || "https://YOUR_PROJECT_REF.supabase.co").replace(/\/$/, "");
const builtInSecretKey = (() => {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return typeof keys.default === "string" ? keys.default : "";
  } catch {
    return "";
  }
})();
const serviceKey = Deno.env.get("ARCADE_SECRET_KEY") || builtInSecretKey || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const builtInPublishableKey = (() => {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "{}");
    return typeof keys.default === "string" ? keys.default : "";
  } catch {
    return "";
  }
})();
const expectedPublicKey = Deno.env.get("ARCADE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || builtInPublishableKey || Deno.env.get("SUPABASE_ANON_KEY") || "";
const admin = serviceKey ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

function cors(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : SITE_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
function validUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function cleanName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().replace(/\s+/g, " ").slice(0, 18);
}
async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function getIpHash(req: Request): Promise<string> {
  const forwarded = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const salt = Deno.env.get("ARCADE_RATE_SALT") || supabaseUrl;
  return await sha256(salt + ":" + forwarded);
}
function decodeTrace(trace: unknown): number[] | null {
  if (typeof trace !== "string" || trace.length < 1 || trace.length > MAX_TRACE) return null;
  const frames: number[] = [];
  for (const char of trace) {
    const value = TRACE_ALPHABET.indexOf(char);
    if (value < 0) return null;
    frames.push(value);
  }
  return frames;
}
function rngFromSeed(seed: number) {
  let a = Number(seed) >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Replay = { valid: boolean; score: number; reason?: string; durationMs?: number };
function replaySnake(frames: number[], seed: number): Replay {
  const snake = [{ x: 7, y: 10 }, { x: 6, y: 10 }, { x: 5, y: 10 }];
  let direction = { x: 1, y: 0 };
  let food = { x: 14, y: 8 };
  let score = 0;
  let durationMs = 0;
  const random = rngFromSeed(seed);
  const makeFood = () => {
    let p: { x: number; y: number };
    do { p = { x: Math.floor(random() * 20), y: Math.floor(random() * 20) }; }
    while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
  };
  let ended = false;
  for (const code of frames) {
    // Mirror the slower client timer: snake accelerates gradually, down to 95 ms per tick.
    durationMs += Math.max(95, 190 - Math.floor(score / 20) * 2);
    const candidates = [
      { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 },
    ];
    if (code > 3) return { valid: false, score, reason: "invalid_snake_input" };
    const next = candidates[code];
    // Replay the final direction registered for this tick. The browser's input handler
    // may accept two turns between frames, so validate the replayed collision/result rather
    // than rejecting a direction change based solely on the prior input event.
    direction = next;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const eats = head.x === food.x && head.y === food.y;
    const body = eats ? snake : snake.slice(0, -1);
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || body.some(s => s.x === head.x && s.y === head.y)) {
      ended = true;
      break;
    }
    snake.unshift(head);
    if (eats) { score += 10; food = makeFood(); } else snake.pop();
  }
  return ended ? { valid: true, score, durationMs } : { valid: false, score, durationMs, reason: "round_not_finished" };
}
const TETROMINOES: Array<Array<[number,number]>> = [
  [[0,1],[1,1],[2,1],[3,1]], // I
  [[1,0],[2,0],[1,1],[2,1]], // O
  [[1,0],[0,1],[1,1],[2,1]], // T
  [[1,0],[2,0],[0,1],[1,1]], // S
  [[0,0],[1,0],[1,1],[2,1]], // Z
  [[0,0],[0,1],[1,1],[2,1]], // J
  [[2,0],[0,1],[1,1],[2,1]], // L
];
function rotateCells(cells: Array<[number,number]>): Array<[number,number]> {
  return cells.map(([x,y]) => [3-y,x] as [number,number]);
}
function tetrisCollides(board: number[][], piece: any, x: number, y: number, cells: Array<[number,number]>): boolean {
  for(const [cx,cy] of cells) {
    const px=x+cx, py=y+cy;
    if(px<0||px>=10||py>=20)return true;
    if(py>=0&&board[py][px])return true;
  }
  return false;
}
function replayTetris(frames: number[], seed: number): Replay {
  const random=rngFromSeed(seed);
  const board=Array.from({length:20},()=>Array(10).fill(0));
  let score=0,lines=0,gravity=0,rotateHeld=false,dropHeld=false;
  const nextPiece=()=>({x:3,y:0,type:Math.floor(random()*TETROMINOES.length),cells:null as Array<[number,number]>|null});
  let piece=nextPiece();
  const cells=()=>piece.cells||TETROMINOES[piece.type];
  const collides=(x:number,y:number,c:Array<[number,number]>)=>tetrisCollides(board,piece,x,y,c);
  const fallEvery=()=>Math.max(7,14-Math.floor(score/600));
  const lock=():boolean=>{
    const active=cells();
    if(active.some(([x,y])=>piece.y+y<0))return true;
    for(const [x,y] of active)board[piece.y+y][piece.x+x]=piece.type+1;
    const remaining=board.filter(row=>row.some(v=>v===0)),cleared=20-remaining.length;
    if(cleared){
      board.length=0;
      Array.from({length:cleared},()=>Array(10).fill(0)).concat(remaining).forEach(row=>board.push(row));
      lines+=cleared;
      const points=[0,100,300,500,800][Math.min(4,cleared)]*(Math.floor(score/500)+1);
      score+=points;
    }
    piece=nextPiece();piece.cells=TETROMINOES[piece.type].map(([x,y])=>[x,y] as [number,number]);piece.x=3;piece.y=0;gravity=0;
    return collides(piece.x,piece.y,cells());
  };
  for(const mask of frames) {
    if(mask>31)return {valid:false,score,reason:"invalid_tetris_input"};
    if((mask&1)&&!collides(piece.x-1,piece.y,cells()))piece.x--;
    if((mask&2)&&!collides(piece.x+1,piece.y,cells()))piece.x++;
    const rotate=Boolean(mask&8);
    if(rotate&&!rotateHeld&&piece.type!==1) {
      const next=rotateCells(cells());
      if(!collides(piece.x,piece.y,next))piece.cells=next;
    }
    rotateHeld=rotate;
    const hard=Boolean(mask&16);
    if(hard&&!dropHeld) {
      let distance=0;
      while(!collides(piece.x,piece.y+1,cells())){piece.y++;distance++}
      score+=distance*2;dropHeld=true;gravity=0;
      if(lock())return {valid:true,score,reason:"tetris_game_over"};
      continue;
    }
    dropHeld=hard;
    if(mask&4) {
      if(!collides(piece.x,piece.y+1,cells())){piece.y++;score+=1;gravity=0}
      else {gravity=0;if(lock())return {valid:true,score,reason:"tetris_game_over"}}
      continue;
    }
    gravity++;
    if(gravity>=fallEvery()) {
      gravity=0;
      if(!collides(piece.x,piece.y+1,cells()))piece.y++;
      else if(lock())return {valid:true,score,reason:"tetris_game_over"};
    }
  }
  return {valid:false,score,reason:"round_not_finished"};
}
type Point = { x: number; y: number };

// Breakout: reproduce paddle movement, ball physics, brick hits and life loss.
const BREAKOUT_BRICKS = 50;
const BRICK_W = 48, BRICK_H = 15, BRICK_X = 40, BRICK_Y = 42, BRICK_STEP_X = 56, BRICK_STEP_Y = 22;
function replayBreakout(frames: number[], seed: number): Replay {
  let paddleX = 276, ballX = 320, ballY = 322;
  let vx = ((seed & 1) ? 2.5 : -2.5), vy = -3.5;
  const bricks = Array(BREAKOUT_BRICKS).fill(true);
  let lives = 3, score = 0;
  for (const mask of frames) {
    if (mask > 3) return { valid: false, score, reason: "invalid_breakout_input" };
    if (mask & 1) paddleX -= 6;
    if (mask & 2) paddleX += 6;
    paddleX = Math.max(0, Math.min(552, paddleX));
    ballX += vx; ballY += vy;
    if (ballX < 6) { ballX = 6; vx = Math.abs(vx); }
    if (ballX > 634) { ballX = 634; vx = -Math.abs(vx); }
    if (ballY < 6) { ballY = 6; vy = Math.abs(vy); }
    if (vy > 0 && ballY + 6 >= 352 && ballY - 6 <= 362 && ballX >= paddleX - 6 && ballX <= paddleX + 94) {
      ballY = 346; vy = -Math.abs(vy);
      const impact = (ballX - (paddleX + 44)) / 44;
      vx = Math.max(-3.2, Math.min(3.2, impact * 3.2));
      if (Math.abs(vx) < 0.6) vx = ((seed + (3 - lives)) & 1) ? 0.6 : -0.6;
    }
    for (let i = 0; i < bricks.length; i++) {
      if (!bricks[i]) continue;
      const x = BRICK_X + (i % 10) * BRICK_STEP_X;
      const y = BRICK_Y + Math.floor(i / 10) * BRICK_STEP_Y;
      if (ballX + 6 >= x && ballX - 6 <= x + BRICK_W && ballY + 6 >= y && ballY - 6 <= y + BRICK_H) {
        bricks[i] = false; vy = -vy; score += 10; break;
      }
    }
    if (bricks.every(v => !v)) return { valid: true, score, reason: "level_clear" };
    if (ballY - 6 > 400) {
      lives--;
      if (lives <= 0) return { valid: true, score, reason: "game_over" };
      ballX = 320; ballY = 322;
      vx = ((seed + (3 - lives)) & 1) ? 2.5 : -2.5; vy = -3.5;
    }
  }
  return { valid: false, score, reason: "round_not_finished" };
}

// Compact Pac-Man maze with deterministic ghost movement for score replay.
const PAC_W = 20, PAC_H = 12;
const PAC_DIRS: Point[] = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
const PAC_GHOST_STARTS: Point[] = [{ x: 10, y: 5 }, { x: 17, y: 9 }, { x: 7, y: 9 }];
function makePacMaze(): number[][] {
  const maze = Array.from({ length: PAC_H }, (_, y) =>
    Array.from({ length: PAC_W }, (_, x) => (x === 0 || x === PAC_W - 1 || y === 0 || y === PAC_H - 1) ? 1 : 0)
  );
  for (let x = 2; x <= 6; x++) if (x !== 4) maze[3][x] = 1;
  for (let y = 2; y <= 5; y++) if (y !== 4) maze[y][9] = 1;
  for (let y = 6; y <= 9; y++) if (y !== 8) maze[y][14] = 1;
  for (let x = 4; x <= 8; x++) if (x !== 6) maze[7][x] = 1;
  return maze;
}
function pacNeighbors(maze: number[][], p: Point): Array<Point & { order: number }> {
  const directions: Point[] = [{ x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }];
  const out: Array<Point & { order: number }> = [];
  for (let i = 0; i < directions.length; i++) {
    const d = directions[i], x = p.x + d.x, y = p.y + d.y;
    if (x >= 0 && x < PAC_W && y >= 0 && y < PAC_H && !maze[y][x]) out.push({ x, y, order: i });
  }
  return out;
}
function movePacGhost(ghost: Point, player: Point, maze: number[][]): void {
  const options = pacNeighbors(maze, ghost);
  options.sort((a, b) =>
    (Math.abs(a.x - player.x) + Math.abs(a.y - player.y)) -
    (Math.abs(b.x - player.x) + Math.abs(b.y - player.y)) || a.order - b.order
  );
  if (options.length) { ghost.x = options[0].x; ghost.y = options[0].y; }
}
function replayPacman(frames: number[], _seed: number): Replay {
  const maze = makePacMaze();
  let ghosts: Point[] = PAC_GHOST_STARTS.map(p => ({ x: p.x, y: p.y }));
  const pellets = maze.map((row, y) =>
    row.map((wall, x) => wall === 0 && !(x === 1 && y === 1) && !ghosts.some(g => g.x === x && g.y === y))
  );
  let dots = pellets.flat().filter(Boolean).length;
  let player: Point & { dir: number } = { x: 1, y: 1, dir: 1 };
  let ticks = 0, lives = 3, score = 0;
  const hit = (): "respawn" | "over" => {
    lives--;
    if (lives <= 0) return "over";
    player = { x: 1, y: 1, dir: 1 };
    ghosts = PAC_GHOST_STARTS.map(p => ({ x: p.x, y: p.y }));
    ticks = 0;
    return "respawn";
  };
  for (const mask of frames) {
    if (mask > 15) return { valid: false, score, reason: "invalid_pacman_input" };
    if (mask & 1) player.dir = 0;
    else if (mask & 2) player.dir = 1;
    else if (mask & 4) player.dir = 2;
    else if (mask & 8) player.dir = 3;
    const d = PAC_DIRS[player.dir], nx = player.x + d.x, ny = player.y + d.y;
    if (nx >= 0 && nx < PAC_W && ny >= 0 && ny < PAC_H && !maze[ny][nx]) { player.x = nx; player.y = ny; }
    if (ghosts.some(g => g.x === player.x && g.y === player.y)) {
      if (hit() === "over") return { valid: true, score, reason: "game_over" };
      continue;
    }
    if (pellets[player.y][player.x]) {
      pellets[player.y][player.x] = false; dots--; score += 10;
      if (dots <= 0) return { valid: true, score, reason: "level_clear" };
    }
    ticks++;
    if (ticks % 3 === 0) {
      let respawned = false;
      for (const ghost of ghosts) {
        movePacGhost(ghost, player, maze);
        if (ghost.x === player.x && ghost.y === player.y) {
          if (hit() === "over") return { valid: true, score, reason: "game_over" };
          respawned = true; break;
        }
      }
      if (respawned) continue;
    }
  }
  return { valid: false, score, reason: "round_not_finished" };
}

function replayGame(game: string, trace: string, seed: number): Replay {
  const frames=decodeTrace(trace);
  if(!frames)return{valid:false,score:0,reason:"invalid_trace"};
  if(game==="snake")return replaySnake(frames,seed);
  if(game==="tetris")return replayTetris(frames,seed);
  if(game==="breakout")return replayBreakout(frames,seed);
  if(game==="pacman")return replayPacman(frames,seed);
  return{valid:false,score:0,reason:"unknown_game"};
}

Deno.serve(async (req: Request) => {
  const origin=req.headers.get("origin");
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors(origin)});
  if(req.method!=="POST")return json({error:"method_not_allowed"},405,origin);
  if(origin && !ALLOWED_ORIGINS.has(origin))return json({error:"origin_not_allowed"},403,origin);
  if(!admin)return json({error:"server_not_configured",message:"Supabase server-side secret key is unavailable in Edge Function secrets."},503,origin);
  const apiKey=req.headers.get("apikey")||"";
  if(!expectedPublicKey || apiKey!==expectedPublicKey)return json({error:"invalid_api_key"},401,origin);
  let body:any;
  try{body=await req.json()}catch(_){return json({error:"invalid_json"},400,origin)}
  const action=body?.action;
  const ipHash=await getIpHash(req);
  const now=new Date();

  if(action==="view"){
    const page=body?.page, visitorId=body?.visitor_id;
    if(!PAGES.has(page)||!validUuid(visitorId))return json({error:"invalid_view"},400,origin);
    const {count:recent,error:limitError}=await admin.from("site_page_views").select("id",{count:"exact",head:true}).eq("ip_hash",ipHash).gte("created_at",new Date(now.getTime()-60*60*1000).toISOString());
    if(limitError)return json({error:"database_error"},500,origin);
    if((recent||0)>=30)return json({error:"rate_limited"},429,origin);
    const visitorHash=await sha256("view:"+page+":"+visitorId);
    const {error:insertError}=await admin.from("site_page_views").upsert(
      {page_id:page,visitor_hash:visitorHash,ip_hash:ipHash,visit_day:now.toISOString().slice(0,10)},
      {onConflict:"page_id,visitor_hash,visit_day",ignoreDuplicates:true}
    );
    if(insertError)return json({error:"database_error"},500,origin);
    const {count,error:countError}=await admin.from("site_page_views").select("id",{count:"exact",head:true}).eq("page_id",page);
    if(countError)return json({error:"database_error"},500,origin);
    return json({ok:true,page,count:count||0,count_type:"unique_browser_days"},200,origin);
  }

  if(action==="leaderboard"){
    const game=body?.game_id;
    if(typeof game!=="string"||!GAMES.has(game))return json({error:"invalid_game"},400,origin);
    const {data,error}=await admin.from("arcade_scores").select("game_id,player_name,score,created_at").eq("game_id",game).order("score",{ascending:false}).order("created_at",{ascending:true}).limit(10);
    if(error)return json({error:"database_error"},500,origin);
    return json({ok:true,records:data||[]},200,origin);
  }

  if(action==="start"){
    const game=body?.game_id;
    if(typeof game!=="string"||!GAMES.has(game))return json({error:"invalid_game"},400,origin);
    const {count,error:limitError}=await admin.from("arcade_runs").select("id",{count:"exact",head:true}).eq("ip_hash",ipHash).gte("created_at",new Date(now.getTime()-60*60*1000).toISOString());
    if(limitError)return json({error:"database_error"},500,origin);
    if((count||0)>=30)return json({error:"rate_limited"},429,origin);
    const seedArray=new Uint32Array(1);crypto.getRandomValues(seedArray);const seed=seedArray[0]||1;
    const {data,error}=await admin.from("arcade_runs").insert({game_id:game,seed,ip_hash:ipHash}).select("id,game_id,seed,created_at").single();
    if(error||!data)return json({error:"session_create_failed"},500,origin);
    return json({ok:true,run_id:data.id,game_id:data.game_id,seed:Number(data.seed),started_at:data.created_at},200,origin);
  }

  if(action==="finish"){
    const runId=body?.run_id, game=body?.game_id, trace=body?.trace, name=cleanName(body?.player_name), claimed=Number(body?.score);
    if(!validUuid(runId)||typeof game!=="string"||!GAMES.has(game)||name.length<2||!Number.isSafeInteger(claimed)||claimed<1||claimed>100000){
      return json({error:"invalid_submission"},400,origin);
    }
    const frames=decodeTrace(trace);
    if(!frames)return json({error:"invalid_trace"},400,origin);
    const {data:run,error:runError}=await admin.from("arcade_runs").select("id,game_id,seed,created_at,used_at").eq("id",runId).maybeSingle();
    if(runError||!run)return json({error:"invalid_run"},400,origin);
    if(run.game_id!==game||run.used_at)return json({error:"run_already_used_or_wrong_game"},409,origin);
    const age=now.getTime()-new Date(run.created_at).getTime();
    if(age<0||age>SESSION_MAX_AGE_MS)return json({error:"run_expired"},409,origin);
    const replay=replayGame(game,trace,Number(run.seed));
    if(!replay.valid||replay.score!==claimed){
      // Consume a failed run so the same run ID cannot be probed repeatedly with altered traces.
      await admin.from("arcade_runs").update({used_at:now.toISOString()}).eq("id",runId).is("used_at",null);
      return json({error:"score_replay_mismatch",message:"The server could not verify this score. No record was saved."},422,origin);
    }
    const replayDuration = replay.durationMs ?? frames.length * TICK_MS[game];
    const minimumElapsed = Math.max(1000, replayDuration * 0.48 - 1000);
    if(age < minimumElapsed) {
      await admin.from("arcade_runs").update({used_at:now.toISOString()}).eq("id",runId).is("used_at",null);
      return json({error:"run_too_fast"},422,origin);
    }
    const {data:claimedRun,error:consumeError}=await admin.from("arcade_runs").update({used_at:now.toISOString()}).eq("id",runId).is("used_at",null).select("id").maybeSingle();
    if(consumeError||!claimedRun)return json({error:"run_already_used"},409,origin);
    const {data:inserted,error:insertError}=await admin.from("arcade_scores").insert({game_id:game,player_name:name,score:replay.score}).select("game_id,player_name,score,created_at").single();
    if(insertError||!inserted)return json({error:"score_insert_failed"},500,origin);
    return json({ok:true,record:inserted,verified:true,verification:"server_replay"},200,origin);
  }

  return json({error:"unknown_action"},400,origin);
});
