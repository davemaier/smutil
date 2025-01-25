\c smutil;

CREATE TABLE IF NOT EXISTS "domains" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"userId" text,
	"createdByUserId" text,
	"teamId" text,
	"plan" text,
	"paymentStatus" text,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hookDomains" (
	"id" text PRIMARY KEY NOT NULL,
	"hookId" text,
	"domainId" text,
	"totalRequests" integer,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hooks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"domainId" text,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"name" text,
	"teamId" text,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "domains" ADD CONSTRAINT "domains_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "domains" ADD CONSTRAINT "domains_createdByUserId_users_id_fk" FOREIGN KEY ("createdByUserId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "domains" ADD CONSTRAINT "domains_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hookDomains" ADD CONSTRAINT "hookDomains_hookId_hooks_id_fk" FOREIGN KEY ("hookId") REFERENCES "public"."hooks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hookDomains" ADD CONSTRAINT "hookDomains_domainId_domains_id_fk" FOREIGN KEY ("domainId") REFERENCES "public"."domains"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hooks" ADD CONSTRAINT "hooks_domainId_domains_id_fk" FOREIGN KEY ("domainId") REFERENCES "public"."domains"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
