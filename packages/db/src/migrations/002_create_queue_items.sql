CREATE TABLE queue_items (
  id UUID PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  party_name VARCHAR(255) NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  notes TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'seated', 'completed', 'cancelled', 'no_show')),
  eta_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  seater_id UUID,
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_queue_items_restaurant_status ON queue_items(restaurant_id, status);
