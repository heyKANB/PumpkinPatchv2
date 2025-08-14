// Farm configuration constants
export const FARM_SIZE = 8; // 8x8 grid of planting plots
export const PLOT_SIZE = 2; // Size of each plot in world units
export const FARM_BOUNDS = 10; // How far the player can move from center

// Growth timing
export const GROWTH_STAGES = ['seed', 'sprout', 'growing', 'mature'] as const;
export const GROWTH_TIME_PER_STAGE = 5000; // 5 seconds per stage in milliseconds

// Player settings
export const PLAYER_SPEED = 5;
export const CAMERA_FOLLOW_SPEED = 0.05;

// Starting inventory
export const STARTING_SEEDS = 10;
export const SEEDS_PER_HARVEST = 2; // Seeds gained when harvesting a mature pumpkin
