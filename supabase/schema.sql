-- BILLFLIRT schema. Run in the Supabase SQL editor. Payments here are SIMULATED until approved.
create type app_role as enum ('seeker','sponsor','admin');
create type bill_status as enum ('pending','verified','rejected','funded');
create table profiles(id uuid primary key references auth.users on delete cascade,display_name text not null,role app_role not null default 'seeker',anonymous boolean default false,city text,blocked boolean default false,created_at timestamptz default now());
create table bills(id uuid primary key default gen_random_uuid(),seeker_id uuid not null references profiles on delete cascade,category text not null,provider text not null,amount numeric(12,2) check(amount>0),currency text default 'KES',due_date date not null,story text check(length(story)<=240),sponsorship_pref text default 'any',status bill_status default 'pending',funded numeric(12,2) default 0,doc_hash text unique,created_at timestamptz default now());
create table bill_private(bill_id uuid primary key references bills on delete cascade,reference_no text,document_path text,ocr_text text,fraud_flag text); -- never exposed to sponsors
create table sponsorships(id uuid primary key default gen_random_uuid(),bill_id uuid references bills,sponsor_id uuid references profiles,amount numeric(12,2) check(amount>0),anonymous boolean default false,method text,status text default 'simulated',reconciled boolean default false,created_at timestamptz default now());
create table swipes(sponsor_id uuid references profiles,bill_id uuid references bills,direction text check(direction in('left','right','super')),primary key(sponsor_id,bill_id));
create table notifications(id uuid primary key default gen_random_uuid(),user_id uuid references profiles,body text,read boolean default false,created_at timestamptz default now());
create table audit_logs(id bigint generated always as identity primary key,actor uuid,action text,target text,at timestamptz default now());
create table reports(id uuid primary key default gen_random_uuid(),reporter uuid references profiles,target_user uuid references profiles,reason text,created_at timestamptz default now());
create function is_admin() returns boolean language sql security definer as $$select exists(select 1 from profiles where id=auth.uid() and role='admin')$$;
-- Public card view: no reference numbers, no documents, no exact identity for anonymous users
create view bill_cards as select b.id,b.category,b.amount,b.currency,b.due_date,b.story,b.funded,b.status,case when p.anonymous then 'Anonymous' else split_part(p.display_name,' ',1) end as first_name,p.city from bills b join profiles p on p.id=b.seeker_id where b.status='verified';
alter table profiles enable row level security;alter table bills enable row level security;alter table bill_private enable row level security;alter table sponsorships enable row level security;alter table swipes enable row level security;alter table notifications enable row level security;alter table audit_logs enable row level security;alter table reports enable row level security;
create policy own_profile on profiles for select using(id=auth.uid() or is_admin());
create policy own_bills on bills for all using(seeker_id=auth.uid() or is_admin());
create policy sponsors_see_verified on bills for select using(status='verified');
create policy admin_private on bill_private for all using(is_admin());
create policy own_private on bill_private for insert with check(exists(select 1 from bills where id=bill_id and seeker_id=auth.uid()));
create policy sponsor_pay on sponsorships for insert with check(sponsor_id=auth.uid());
create policy see_sponsorships on sponsorships for select using(sponsor_id=auth.uid() or is_admin() or exists(select 1 from bills where id=bill_id and seeker_id=auth.uid()));
create policy own_swipes on swipes for all using(sponsor_id=auth.uid());
create policy own_notes on notifications for all using(user_id=auth.uid());
create policy admin_audit on audit_logs for all using(is_admin());
create policy file_report on reports for insert with check(reporter=auth.uid());
-- Storage: create a PRIVATE bucket 'bill-documents'; allow insert for owners, read for admins only (use signed URLs, redacted copies for sponsors).
