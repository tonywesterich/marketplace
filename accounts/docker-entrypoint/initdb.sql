CREATE TABLE public.users (
	"id" varchar(36) NOT NULL,
	"email" varchar(60) NOT NULL,
  "password" varchar(60) NOT NULL,
  "name" varchar(50) NOT NULL,
  "role" varchar(8) NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_uq UNIQUE (email)
);

INSERT INTO public.users
  (
    id,
    email,
    password,
    name,
    role
  )
VALUES
  (
    'a7ad5c9a-939c-4349-a1c0-20100399f0e7',
    'admin@example.com',
    '$2b$10$qXsnOWCw6usPXiCHa03sPebsozoGhFelTZw.501.C6mKvdZuyl2pO',
    'Administrator',
    'admin'
  )
