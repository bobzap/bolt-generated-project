/*
  # Initialize Planning Application Schema
  
  1. New Tables
    - teams: Store team information with color codes
    - work_types: Different types of work that can be assigned
    - tasks: Main tasks table with scheduling information
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    
  3. Indexes
    - Add indexes for frequently queried columns
    - Add foreign key constraints for data integrity
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work_types table
CREATE TABLE IF NOT EXISTS work_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  duration integer NOT NULL, -- in minutes
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON teams
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON work_types
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable write access for authenticated users" ON teams
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable write access for authenticated users" ON work_types
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable write access for authenticated users" ON tasks
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS tasks_team_id_idx ON tasks(team_id);
CREATE INDEX IF NOT EXISTS tasks_date_range_idx ON tasks(start_date, end_date);
CREATE INDEX IF NOT EXISTS work_types_team_id_idx ON work_types(team_id);
