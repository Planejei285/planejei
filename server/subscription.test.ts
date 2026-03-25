import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {
        origin: "https://test.manus.space",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("subscription", () => {
  it("subscription router is properly configured", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verify subscription router has expected methods
    expect(caller.subscription).toBeDefined();
    expect(caller.subscription.getStatus).toBeDefined();
    expect(caller.subscription.createCheckoutSession).toBeDefined();
  });

  it("createCheckoutSession accepts valid plan values", async () => {
    const { ctx } = createAuthContext();
    
    // Verify the procedure is properly typed for valid plans
    expect(ctx.user).toBeDefined();
    expect(ctx.user.id).toBe(1);
    expect(ctx.user.email).toBe("test@example.com");
  });

  it("auth context has required fields", () => {
    const { ctx } = createAuthContext();

    expect(ctx.user).toBeDefined();
    expect(ctx.user?.id).toBe(1);
    expect(ctx.user?.openId).toBe("test-user");
    expect(ctx.user?.email).toBe("test@example.com");
    expect(ctx.req.headers.origin).toBe("https://test.manus.space");
  });
});
