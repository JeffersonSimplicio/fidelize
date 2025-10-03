PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_customer_rewards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer NOT NULL,
	`reward_id` integer NOT NULL,
	`redeemed_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reward_id`) REFERENCES `rewards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_customer_rewards`("id", "customer_id", "reward_id", "redeemed_at") SELECT "id", "customer_id", "reward_id", "redeemed_at" FROM `customer_rewards`;--> statement-breakpoint
DROP TABLE `customer_rewards`;--> statement-breakpoint
ALTER TABLE `__new_customer_rewards` RENAME TO `customer_rewards`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_customer_reward` ON `customer_rewards` (`customer_id`,`reward_id`);--> statement-breakpoint
ALTER TABLE `rewards` ADD `is_active` integer DEFAULT 1 NOT NULL;