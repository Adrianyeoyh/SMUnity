--
-- PostgreSQL database dump
--

\restrict Jp4Z8oGFIPrVTMxD0csYB8KaZD5eKERUieiPQI1xeTrZ04UkMaFlDMZMbR6XEXC

-- Dumped from database version 17.5 (6bc9ef8)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: account_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_type AS ENUM (
    'student',
    'organisation',
    'admin'
);


ALTER TYPE public.account_type OWNER TO postgres;

--
-- Name: application_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.application_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'confirmed',
    'withdrawn',
    'cancelled'
);


ALTER TYPE public.application_status OWNER TO postgres;

--
-- Name: attachment_owner; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.attachment_owner AS ENUM (
    'project',
    'organisation',
    'profile',
    'application'
);


ALTER TYPE public.attachment_owner OWNER TO postgres;

--
-- Name: interview_outcome; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.interview_outcome AS ENUM (
    'pending',
    'pass',
    'fail',
    'no_show',
    'reschedule'
);


ALTER TYPE public.interview_outcome OWNER TO postgres;

--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type AS ENUM (
    'info',
    'warning',
    'success',
    'action'
);


ALTER TYPE public.notification_type OWNER TO postgres;

--
-- Name: request_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.request_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.request_status OWNER TO postgres;

--
-- Name: requirement_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.requirement_type AS ENUM (
    'CSU_MODULE',
    'ONTRAC'
);


ALTER TYPE public.requirement_type OWNER TO postgres;

--
-- Name: verification_action; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verification_action AS ENUM (
    'submitted',
    'approved',
    'rejected',
    'closed',
    'reopened'
);


ALTER TYPE public.verification_action OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id text NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    user_id text NOT NULL,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at timestamp without time zone,
    refresh_token_expires_at timestamp without time zone,
    scope text,
    password text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    project_id uuid NOT NULL,
    user_id text NOT NULL,
    status public.application_status DEFAULT 'pending'::public.application_status NOT NULL,
    motivation text NOT NULL,
    experience text NOT NULL,
    skills text,
    comments text,
    acknowledge_schedule boolean DEFAULT false NOT NULL,
    agree boolean DEFAULT false NOT NULL,
    submitted_at timestamp without time zone DEFAULT now() NOT NULL,
    decided_at timestamp without time zone
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id text NOT NULL,
    type public.notification_type NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: organisation_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisation_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    requester_email text NOT NULL,
    requester_name text,
    org_name character varying(160) NOT NULL,
    org_description text,
    website character varying(255),
    phone character varying(50),
    status public.request_status DEFAULT 'pending'::public.request_status NOT NULL,
    decided_by text,
    decided_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    comments text
);


ALTER TABLE public.organisation_requests OWNER TO postgres;

--
-- Name: organisations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organisations (
    user_id text NOT NULL,
    slug character varying(160) NOT NULL,
    description text,
    website character varying(255),
    phone character varying(50),
    created_by text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    suspended boolean DEFAULT false NOT NULL
);


ALTER TABLE public.organisations OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    user_id text NOT NULL,
    phone character varying(50),
    student_id character varying(20),
    entry_year integer,
    school character varying(100),
    skills text[],
    interests text[]
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: project_memberships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_memberships (
    project_id uuid NOT NULL,
    user_id text NOT NULL,
    accepted_at timestamp without time zone
);


ALTER TABLE public.project_memberships OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    project_id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id text NOT NULL,
    title character varying(255) NOT NULL,
    summary character varying(500),
    category text,
    type character varying(20) DEFAULT 'local'::character varying NOT NULL,
    country character varying(100),
    description text NOT NULL,
    about_provide text,
    about_do text,
    requirements text,
    skill_tags text[] DEFAULT ARRAY[]::text[],
    district character varying(120),
    google_maps character varying(1024),
    latitude real,
    longitude real,
    is_remote boolean DEFAULT false NOT NULL,
    repeat_interval integer,
    repeat_unit character varying(10),
    days_of_week text[],
    time_start time without time zone,
    time_end time without time zone,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    apply_by timestamp without time zone,
    slots_total integer DEFAULT 0 NOT NULL,
    required_hours integer DEFAULT 0 NOT NULL,
    image_url character varying(1024),
    project_tags text[] DEFAULT ARRAY[]::text[],
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: saved_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saved_projects (
    project_id uuid NOT NULL,
    user_id text NOT NULL,
    saved_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.saved_projects OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    ip_address text,
    user_agent text,
    user_id text NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    email_verified boolean NOT NULL,
    image text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    account_type text DEFAULT 'student'::text NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.verification OWNER TO postgres;

--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) FROM stdin;
admin	admin	credential	admin	\N	\N	\N	\N	\N	\N	f9892a5635a984b5fa150b3c165d80d8:1681a10d3d65fe94f472a45c97a742dfa5867ab024fffee8cd186a0f1610e371f1a1cc788d75dcc02061830db2b82ef8b6e44c72c59cc6bc9f5d8fea27051e91	2025-11-04 16:30:52.944	2025-11-04 16:30:52.944
org1	org1	credential	org1	\N	\N	\N	\N	\N	\N	7fcdd13bdfbedcb21f7c8570814d33a4:a6d99459e847388ebcfb178d51674e12d92113fd8a10be18316d82dcdde79c830635b2a499acbde17990235c2a253cb70a3e09fc19082004dd7d1cba8aa3ee8a	2025-11-04 16:30:53.15	2025-11-04 16:30:53.15
org2	org2	credential	org2	\N	\N	\N	\N	\N	\N	36e6f2d1880f863694e56c68965924e0:135df72fbca4d88f46db96f2e7bd1c171b61f484bd390997975ba1b84aa65fc53823f1c7101a415e2b58ebb23befd1e2c6152cec5f3baba41456077400bf9ac4	2025-11-04 16:30:53.328	2025-11-04 16:30:53.328
org3	org3	credential	org3	\N	\N	\N	\N	\N	\N	0276866771c5d7957ee8ab26766e1847:140ac29029d9caaf36bc1696c1f09da1f28a0f47fefceb43e54b805e64011ea3ba3476c4db1ec68c95ad99a90a87684f9c0b80d2f72f74a9002943e09514750b	2025-11-04 16:30:53.51	2025-11-04 16:30:53.51
stud1	stud1	credential	stud1	\N	\N	\N	\N	\N	\N	4d0a3f3928ffae07af44422c02960a41:0a694bfd43c5df87b55b30e1a62b2e088611c79a1128f355bc37e0030a89d2b5b8afe815185832e3249f534421eeda49e44dc36e637a26f743137cbbd92b6820	2025-11-04 16:30:53.705	2025-11-04 16:30:53.705
stud2	stud2	credential	stud2	\N	\N	\N	\N	\N	\N	45b69b477c41bdabc740557b02560410:0d8c3400f32731de1523a0c2fee9d3b5b2944a289ead0b9729ae29d9fe01e4b2006029b9f8e172953cae079d091e6a7e80907096fb68a64752fcb8e472e6fab0	2025-11-04 16:30:53.878	2025-11-04 16:30:53.878
stud3	stud3	credential	stud3	\N	\N	\N	\N	\N	\N	8d4763641054652990f70fed5726ec59:10dd9f7b3a36b4cedc00038acfb137dfd4510e38fb16ae93ed7a076a622c4287a27b7df408f8f0327a9ca523f08f7820409dca6faa990779f03eb04b655d9ce7	2025-11-04 16:30:54.052	2025-11-04 16:30:54.052
stud4	stud4	credential	stud4	\N	\N	\N	\N	\N	\N	363674ea83fc981425c669051dac12f4:804a6267de28684cfea146ace58ec06f672d8e32982c9f831a37111b895cef89b535ecb7ad2391a25169c58246c3b03243a8334514a7cdafba4e7ba0a0b6441d	2025-11-04 16:30:54.232	2025-11-04 16:30:54.232
M9VSjfzjdA1mqIWzcJ9mG8hspszD7sk3	AWtzo41ojhatk16TwCLRDOQ5ish9CEYC	credential	AWtzo41ojhatk16TwCLRDOQ5ish9CEYC	\N	\N	\N	\N	\N	\N	0921d16e30d130a2d0261f94c31291ac:8cdd22e2c2aa1847bf0b5ed1f3155122c7580092cf8c2da95a8af61fabe462adc77b1fb58c61913444c10af4e670d302c3d4e148aca7fadfdcf3f234ba03d315	2025-11-05 17:11:10.019	2025-11-05 17:11:10.019
QdONzsBcI4oJMckHnXxgGMib2f8vdKqf	guTai2Fk2LAUHaUpCmZZFJx79rhtNzih	credential	guTai2Fk2LAUHaUpCmZZFJx79rhtNzih	\N	\N	\N	\N	\N	\N	970bdb3d6aae28debe1f7e8fba58f173:41506562adfe272ca29680863724526795f64dab6daefd65268b6df4517ec1e16d28e3730918cb1c88e0d21bd5fed144d88ff1a415a60639aead14d361fc9e97	2025-11-05 16:57:46.482	2025-11-05 16:57:46.482
caleb-s-cars	caleb-s-cars	credential	caleb-s-cars	\N	\N	\N	\N	\N	\N	3124714c576ba3f859331a7431b9092e:1166f1e86e2e4dcbaa931d0d18f6dc905b778b62b6b018b6e751497734ad441a69c2af2559d35b88e83b4477e2d578f52ed4c8eacfdfc8f2f543ddb23035bc54	2025-11-05 17:07:27.565	2025-11-05 17:07:27.565
Fz6XnKYnEpzBKtfb3TekZhnuqQVGVLbO	tv2J3lJ30vyDEPbqzgLjCIindiAuyId0	credential	tv2J3lJ30vyDEPbqzgLjCIindiAuyId0	\N	\N	\N	\N	\N	\N	a85b6e6b961811a60a72d1716dc92863:2e195c61f3236804ab6f2c1dc92f7094b572eb3c82de643d8a432551bd2c5f324baabbcd2d3b4c2360eed150e224f1bc7e636ba6daf551fb8c906387c483f306	2025-11-05 18:54:29.882	2025-11-05 18:54:29.882
vNNn183p4PBIQmHYDA6Kb6t1JhKPRU0A	GOmA51zmbr5a4mmUVJpXcWu2Sw0kI8TC	credential	GOmA51zmbr5a4mmUVJpXcWu2Sw0kI8TC	\N	\N	\N	\N	\N	\N	f2119fad49fa7493a145c24a4f75d81e:e89df485b630035134c3dc157dd6400900850e681ba70774288ab48350ae7d26d03c60776a3ebfc3ab62d18ed874e6383d5383be1ee4523ebdf2c0d19023ac86	2025-11-06 08:06:40.051	2025-11-06 08:06:40.051
9U9FaM2HskmaSxfIO9iRcipvw4phQayJ	rtPadEb81VOt8mvN92XdHsGgPaG7roTV	credential	rtPadEb81VOt8mvN92XdHsGgPaG7roTV	\N	\N	\N	\N	\N	\N	401c5d4af22fa773c767bdb9bcc712a0:a9a9a8cd5876f61452477b8a4ef09bc8792240f8f17a0c4c3c64fd83d5e5235891f5406856b234149fbf2db440a2b3d762c089d861791d46027761a900a6e722	2025-11-06 08:36:36.503	2025-11-06 08:36:36.503
RD7wnwVUe6apN1h8pwTrbEBY0uWAvtN2	dAjHKWOxqbj8R50QEa3oA0NBsDnaFKu6	credential	dAjHKWOxqbj8R50QEa3oA0NBsDnaFKu6	\N	\N	\N	\N	\N	\N	0119d1a166d97cf772f7312a4be53275:464809309b185e101f6c8adf2827e7172f38dd185a21811f188188bc1f1e5bf63bd02dccc007127c3536f121928d15fa78b19071ed8dee1af415a2449842b075	2025-11-06 08:45:32.123	2025-11-06 08:45:32.123
p5aAtqmvFBS2yxoCkxGR9DprCjqA9uCY	6Kr5a2DttxauHU467C7IYpeG6pJuPrNo	credential	6Kr5a2DttxauHU467C7IYpeG6pJuPrNo	\N	\N	\N	\N	\N	\N	abbe7a6bbc905d5362d48f73abe1ee6e:2a97f90a4050f0003988ef1bf861f644ec2ae166e93113ed0510081a37437fab4196bacfe93403e027eefe2ffbcfee130d4542c6ceb202076b97e387562d72c7	2025-11-06 09:21:41.053	2025-11-06 09:21:41.053
centre-for-social-responsibility	centre-for-social-responsibility	credential	centre-for-social-responsibility	\N	\N	\N	\N	\N	\N	9c2383860f000ae5731a565d06c44b52:d7b679fc2f22bb6a72c574a1be43f2e41ac40b49fc880c2ab170bf6c5d16e0680e17baba68a6e36e9591c5c54deb9f63962b610b8d8194787a8ea4d9748ee431	2025-11-06 09:59:23.066	2025-11-06 09:59:23.066
smu-rotaract	smu-rotaract	credential	smu-rotaract	\N	\N	\N	\N	\N	\N	06cc0188a2431759426bb9f2b2772f45:832835d69b34305c2e5b2b566837a5804c32101a33569eb300c9146a79c2e2d6c07117c5feca8cfb9e212c3c2e18d7167edbce8368464b6ede53697232528e11	2025-11-06 10:07:06.387	2025-11-06 10:07:06.387
smu-kidleidoscope	smu-kidleidoscope	credential	smu-kidleidoscope	\N	\N	\N	\N	\N	\N	50f68d5c81829bd7b3948763b8e95e6a:5571ac7a5aaf223df5be44997af31a7725bddedacddd5ba8893cfa44b8466b520852ec92072a63b359773800a7cd48c762a4da6749307cf33dae5303ea19742c	2025-11-06 10:07:37.773	2025-11-06 10:07:37.773
smu-art2heart	smu-art2heart	credential	smu-art2heart	\N	\N	\N	\N	\N	\N	0635998ab2564a7210224edafe88fcbf:0054774425c1595c6ef8dd4176acecd060573c90fc5cf42d3da3655e5665f9cbc98a15e55bc45dd877f024e9fe8d168e2c46dd0347a8ca5b8d49608b57d62bbf	2025-11-06 10:17:09.086	2025-11-06 10:17:09.086
smu-artis	smu-artis	credential	smu-artis	\N	\N	\N	\N	\N	\N	d7ba61713a4016dd36fb9def952c5933:61593b93f550c1afa779610477d7ac8482f64d040261fb2720ffaae2d308a728dc6f087486b9eb3426c7844effe7967f0cb08c72867b19c0ab0ca3cb50305523	2025-11-06 10:17:37.938	2025-11-06 10:17:37.938
smu-inspirar	smu-inspirar	credential	smu-inspirar	\N	\N	\N	\N	\N	\N	b56a1d9d56eab46f01efcd9a9c195da9:718f6fb6490b7b7435edd3787477bf7292474a23cb601bbca12c1b661cbc1214025228f3aba8a5f5ae96146f82134d024d97566c27f098a0758a8dc9f06747fc	2025-11-06 10:18:25.835	2025-11-06 10:18:25.835
starringsmu	starringsmu	credential	starringsmu	\N	\N	\N	\N	\N	\N	0c5ca01fd7ac88d3f9550367aca443b8:30af17b9f062a37ea219e9fca7a7e15ccddcad4dece41b20a913496ad9f6ddf86d4b68ad8843cfb3161acccc848e25491d95fdc2fda0443abb7a3b7205ca8d67	2025-11-06 10:18:50.43	2025-11-06 10:18:50.43
world-wide-fund-for-nature	world-wide-fund-for-nature	credential	world-wide-fund-for-nature	\N	\N	\N	\N	\N	\N	70fcd4ac75fd3adb5f3ae611b6772b1c:021f006a61be0bb003293fd32577f96ed8ae2a38805b43bd01f20c32f533a33acd2eb3db829081928987279f1d21972b974cb060ff8c5ffb8e63633ce25b087d	2025-11-06 10:19:17.566	2025-11-06 10:19:17.566
cats-at-yishun	cats-at-yishun	credential	cats-at-yishun	\N	\N	\N	\N	\N	\N	d82e12f7fdb661f6fd502d9d20160220:a134238db79e1dd4cea485ced08a260a6b4ad6967de9eff9cf0f43030ab0971d3ef0e839adbd874c5ce03078865528130dbedca0a4d29c2bbf450e2c734e302f	2025-11-06 10:28:37.429	2025-11-06 10:28:37.429
smu-boribo	smu-boribo	credential	smu-boribo	\N	\N	\N	\N	\N	\N	c3f8dd7a8c465422d01eccb296d2e0b0:9138c63aae0902303863b494bb64880ced58d15c7147c75cc16f0d6e3f38b576f06e5d996238039158217fc5e574ad609f02a7544700696e028eec399f2aaaa1	2025-11-06 10:32:30.397	2025-11-06 10:32:30.397
smu-du-xing	smu-du-xing	credential	smu-du-xing	\N	\N	\N	\N	\N	\N	603fe033ee7da1784901f03a5a69150a:c3db8bae126c0aa64f17ce478aeefdc8e75947fef5d115e3be7dae370c8a5a56c6e5adfe722e226cfdf90da808346bb00d44a9c69656c84e6d081c15805dceed	2025-11-06 10:37:42.15	2025-11-06 10:37:42.15
smu-luminaire	smu-luminaire	credential	smu-luminaire	\N	\N	\N	\N	\N	\N	f688e0a2410af9b912427879a71ffca3:5f155efc4e99bb33785b40cf8fae3390e20cb8c82b7cf3efebbac1b307863908b64435a42da376fc89bbd1f21f8c93510e323a5ddfad689382ef05daab106986	2025-11-06 10:43:35.298	2025-11-06 10:43:35.298
org4	org4	credential	org4	\N	\N	\N	\N	\N	\N	b76efd9ea480463da6e9bd15d1df3235:6539a1903d697cac44de43d55417f3b9fcfaf5ee9103d46a9ef52612d92b91518b281dfc230cc88d5b5e4b59c36a32209ad993485254bdb437d748bccacf02e3	2025-11-06 10:49:28.012	2025-11-06 10:49:28.012
org5	org5	credential	org5	\N	\N	\N	\N	\N	\N	09622cd65290bc342cb74c91c9d84d74:c7216678ece0609099ce4a72c98b7222bc688600a95f2dc5c23c42e3ca84a9c924b4a0e6b54af4bb49e9784ff51f01feea243b1482457dd558b8e6398e1e5908	2025-11-06 10:49:28.226	2025-11-06 10:49:28.226
org6	org6	credential	org6	\N	\N	\N	\N	\N	\N	c04326687a04403e96302be317ddd91f:09287d7337b020f274c3051abddcf6bf0dcb7a4f5af5e51aa04e3f94c2c5b9f310b9fa9805f0e4ae94108745e11601f4a136fbea815cbe2f1c21a11744958daf	2025-11-06 10:49:28.446	2025-11-06 10:49:28.446
smu-hai-khun	smu-hai-khun	credential	smu-hai-khun	\N	\N	\N	\N	\N	\N	c9bc8c19e675cac9737c0344f4582814:b2062ee1c4c5282f152723a05242c201b8c5ea298792bddbe726c3ed5e226c542dd513003fa4f651f72aee17679125f1ed3586a53ec79fad3698ce163ad79f96	2025-11-06 10:49:36.924	2025-11-06 10:49:36.924
smu-sunshine	smu-sunshine	credential	smu-sunshine	\N	\N	\N	\N	\N	\N	e12742b202c83a8f25982d81ad8cbf92:ba0dacaf52d27631ee4f0b935559eae27698c73e418f34fb06a3d84dfdce874a0005144401a57da823b51aa59decc5e46939efa84be56bfc03e4215dde908032	2025-11-06 11:10:29.111	2025-11-06 11:10:29.111
RAS8vX8AGcqJoAY0qWAER2p8GXJOAAqN	bj8h1XxtumdM1ewjgfqNbDXbsgb1bk5J	credential	bj8h1XxtumdM1ewjgfqNbDXbsgb1bk5J	\N	\N	\N	\N	\N	\N	9c6b944fa3e4d7e483cbb52746b53c53:0a66d932ee50090971d998ae65b66462de55e4641f84e6571089e0212179d0097991981da9ca7b01d7b53bd73274eef4b9b6130f46177140f19be1bb86d35bf7	2025-11-06 14:28:44.611	2025-11-06 14:31:57.424
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, project_id, user_id, status, motivation, experience, skills, comments, acknowledge_schedule, agree, submitted_at, decided_at) FROM stdin;
1	c58b55d3-3945-43a3-90bb-e9742e7ed6f4	stud1	pending	I’m excited to contribute and learn.	none	Teamwork, Communication	\N	t	t	2025-11-04 16:30:54.254	\N
2	a04e7f52-12af-4be8-989b-63462daf0be2	stud1	accepted	I’m excited to contribute and learn.	none	Teamwork, Communication	Looking forward to it!	t	t	2025-11-04 16:30:54.266	2025-11-04 16:30:54.266
3	43002c14-f233-432f-b572-d698ee5b0f7d	stud2	rejected	I’m excited to contribute and learn.	extensive	Teamwork, Communication	\N	t	t	2025-11-04 16:30:54.275	2025-11-04 16:30:54.275
4	7c3b6a8c-ee7f-4a0a-9cae-f1370819eea6	stud3	confirmed	I’m excited to contribute and learn.	extensive	Teamwork, Communication	\N	t	t	2025-11-04 16:30:54.284	2025-11-04 16:30:54.284
5	2a7b2da6-f747-4941-8d4b-406b9291b32c	stud2	withdrawn	I’m excited to contribute and learn.	none	Teamwork, Communication	Looking forward to it!	t	t	2025-11-04 16:30:54.299	2025-11-04 16:30:54.299
6	71d084a6-3f01-4309-8289-01fd958b41f5	stud4	accepted	I’m excited to contribute and learn.	some	Teamwork, Communication	\N	t	t	2025-11-04 16:30:54.306	2025-11-04 16:30:54.306
7	f471235f-c366-4cae-a395-a596f49eaf26	stud3	pending	I’m excited to contribute and learn.	none	Teamwork, Communication	\N	t	t	2025-11-04 16:30:54.315	\N
8	7c3b6a8c-ee7f-4a0a-9cae-f1370819eea6	3mCgcAIhcMrGVYoiw5Vtf7y7hc5VYj1X	pending	blahsadf sdf asd fasdfsdfsdf asdf sdf	none			t	t	2025-11-05 12:29:08.795375	\N
9	c58b55d3-3945-43a3-90bb-e9742e7ed6f4	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	pending	Test test test test Test	some			t	t	2025-11-05 13:41:25.730327	\N
10	2a7b2da6-f747-4941-8d4b-406b9291b32c	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	pending	Test test tes tetttttttttttttttttttt	some			t	t	2025-11-05 17:04:13.386681	\N
11	43002c14-f233-432f-b572-d698ee5b0f7d	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	pending	Test test test test test	some			t	t	2025-11-05 18:33:50.937546	\N
13	5239a800-8ede-4313-b757-297db5146623	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	pending	I enjoy teaching and kids are loveable.	some			t	t	2025-11-05 19:07:07.419901	\N
14	71d084a6-3f01-4309-8289-01fd958b41f5	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	pending	xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx	some			t	t	2025-11-05 19:14:02.791015	\N
15	7c3b6a8c-ee7f-4a0a-9cae-f1370819eea6	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	pending	I love cats and they love me.	some			t	t	2025-11-06 09:30:41.381666	\N
12	21fdb6ef-1604-45c7-82c7-d38b8c0cb02b	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	confirmed	I love cats and they are my favourite animal.	some			t	t	2025-11-05 19:06:30.965056	2025-11-06 09:35:12.122
17	b8497655-5155-45a2-83e2-a876c9cf15bd	Qmwgl0GSs35ojZoZGE6caVqeudC1TUC7	confirmed	jbfnalkjndvkj;andsjvnasjdnvaojn	none	cats		t	t	2025-11-06 10:54:57.329435	2025-11-06 11:03:15.43
18	b8497655-5155-45a2-83e2-a876c9cf15bd	RxeTOQl93FocGcu99d7wdR2R4sHjIWv3	confirmed	I love cats MEOWWWWWWW	some			t	t	2025-11-06 11:10:15.522943	2025-11-06 11:14:46.388
16	7c3b6a8c-ee7f-4a0a-9cae-f1370819eea6	rrJdiguhR5hHPJgHfam0Xe4xcVr1Kr5r	confirmed	I want to join because I like animals (Test Application)	none	fdwelmw;fw		t	t	2025-11-06 10:08:20.349061	2025-11-06 11:19:50.989
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, title, message, read, created_at) FROM stdin;
\.


--
-- Data for Name: organisation_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisation_requests (id, requester_email, requester_name, org_name, org_description, website, phone, status, decided_by, decided_at, created_at, comments) FROM stdin;
960154a9-666e-43a8-a434-8849716ca288	hello@greensg.org	Mei Lin	Green Singapore	Environmental stewardship and coastal cleanups.	https://greensg.org	61234567	approved	admin	2025-11-04 16:30:52.968	2025-11-04 16:30:52.968	Looks good.
d8851079-4b0b-4748-8740-7cb69ec49abf	team@pawssg.org	Nur Aisyah	Paws SG	Animal rescue and adoption support.	https://pawssg.org	63987654	rejected	admin	2025-11-04 16:30:52.968	2025-11-04 16:30:52.985	Insufficient documentation; please reapply.
f302a82a-70eb-4663-bbf3-b6e55c4711e7	calynnongyx@gmail.com	Calynn Ong	Matcha Friends	I love matcha	https://www.miffy.com/	+6597869931	approved	admin	2025-11-05 16:57:48.219	2025-11-05 16:53:46.505447	\N
290099c5-1756-4e70-8806-54be58e16704	contact@youthconnect.sg	Daniel Tan	Youth Connect	Mentoring youth and building life skills.	https://youthconnect.sg	69876543	approved	admin	2025-11-05 17:11:09.488	2025-11-04 16:30:52.978	\N
8796b4d0-2392-4730-a122-1708f64b1f76	c4sr@test.com	C4SR	Centre for Social Responsibility (C4SR)	The Centre for Social Responsibility (C4SR), part of the Office of Dean of Students, is dedicated to shape the next generation of socially responsible leaders through SMU’s holistic education approach.\n\nMore than just volunteering, these experiences are deeply intentional. Students are empowered to strategically align their community service projects with the United Nations Sustainable Development Goals (SDGs), allowing them to address pressing global and local challenges. This commitment to service not only deepens students' understanding of societal issues but also unlocks their potential to become agents of change, cultivating values of compassion, responsibility, and leadership. The impact of their contributions extends far beyond their academic years at SMU - nurturing graduates who are grounded, socially conscious, and ready to make a lasting difference in the world.	https://c4sr.smu.edu.sg/	96722702	approved	admin	2025-11-06 08:08:37.701	2025-11-06 08:05:06.24243	\N
44d4a403-f87a-4e3d-89dc-862fdd12438b	organisation1@test.com	organisation1	organisation1	testesttestestststes	https://www.miffy.com/	96722702	approved	admin	2025-11-06 08:36:35.811	2025-11-06 08:36:21.400892	\N
22ae9ef6-fc1e-40a4-afce-2c676df260e8	organisation2@test.com	organisation 2	organisation 2	organisation 2 to test my approval	https://c4sr.smu.edu.sg/	96722702	approved	admin	2025-11-06 08:45:31.617	2025-11-06 08:45:26.693529	\N
a1deb505-d0d0-43db-8b13-0e77efb74733	kaoarara@gmail.com	kara	We Love Animals!	animals love us	\N	+6596724702	approved	admin	2025-11-06 09:21:49.143	2025-11-06 09:21:30.211373	\N
bfdbe209-a095-46f8-8136-2dd243bcb3de	adrianr3started@gmail.com	adrian	tame	tame please	\N	91829319	approved	admin	2025-11-06 09:23:36.223	2025-11-06 09:23:22.380099	\N
19f8beb7-3b56-4ca1-8cd6-e408f4cbdf71	adrianallinone@gmail.com	Adrian Yeo	ADRIAN'S DEPLOYMENT	ADRIAN'S DEPLOYMENT TEST	https://steamcommunity.com	+6596724702	approved	admin	2025-11-06 14:28:44.299	2025-11-06 14:26:21.828151	\N
\.


--
-- Data for Name: organisations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organisations (user_id, slug, description, website, phone, created_by, created_at, updated_at, deleted_at, suspended) FROM stdin;
org1	green-singapore	Green Singapore — community partner.	https://greensg.org	61234567	admin	2025-11-04 16:30:53.159	2025-11-04 16:30:53.159	\N	f
org2	youth-connect	Youth Connect — community partner.	https://youthconnect.sg	69876543	admin	2025-11-04 16:30:53.342	2025-11-04 16:30:53.342	\N	f
org3	paws-sg	Paws SG — community partner.	https://pawssg.org	63987654	admin	2025-11-04 16:30:53.521	2025-11-04 16:30:53.521	\N	f
guTai2Fk2LAUHaUpCmZZFJx79rhtNzih	matcha-friends	I love matcha	https://www.miffy.com/	+6597869931	admin	2025-11-05 16:57:46.467	2025-11-05 16:57:46.467	\N	f
caleb-s-cars	caleb-s-cars	\N	\N	\N	admin	2025-11-05 17:07:27.565	2025-11-05 17:07:27.565	\N	f
rtPadEb81VOt8mvN92XdHsGgPaG7roTV	organisation1	testesttestestststes	https://www.miffy.com/	96722702	admin	2025-11-06 08:36:36.483	2025-11-06 08:36:36.483	\N	f
dAjHKWOxqbj8R50QEa3oA0NBsDnaFKu6	organisation-2	organisation 2 to test my approval	https://c4sr.smu.edu.sg/	96722702	admin	2025-11-06 08:45:32.108	2025-11-06 08:45:32.108	\N	f
6Kr5a2DttxauHU467C7IYpeG6pJuPrNo	we-love-animals-	animals love us	\N	+6596724702	admin	2025-11-06 09:21:41.044	2025-11-06 09:21:41.044	\N	f
smu-rotaract	smu-rotaract	\N	\N	\N	admin	2025-11-06 10:07:06.387	2025-11-06 10:07:06.387	\N	f
smu-kidleidoscope	smu-kidleidoscope	\N	\N	\N	admin	2025-11-06 10:07:37.773	2025-11-06 10:07:37.773	\N	f
smu-art2heart	smu-art2heart	\N	\N	\N	admin	2025-11-06 10:17:09.086	2025-11-06 10:17:09.086	\N	f
smu-artis	smu-artis	\N	\N	\N	admin	2025-11-06 10:17:37.938	2025-11-06 10:17:37.938	\N	f
smu-inspirar	smu-inspirar	\N	\N	\N	admin	2025-11-06 10:18:25.835	2025-11-06 10:18:25.835	\N	f
starringsmu	starringsmu	\N	\N	\N	admin	2025-11-06 10:18:50.43	2025-11-06 10:18:50.43	\N	f
world-wide-fund-for-nature	world-wide-fund-for-nature	\N	\N	\N	admin	2025-11-06 10:19:17.566	2025-11-06 10:19:17.566	\N	f
cats-at-yishun	cats-at-yishun	\N	\N	\N	admin	2025-11-06 10:28:37.429	2025-11-06 10:28:37.429	\N	f
smu-boribo	smu-boribo	\N	\N	\N	admin	2025-11-06 10:32:30.397	2025-11-06 10:32:30.397	\N	f
smu-du-xing	smu-du-xing	\N	\N	\N	admin	2025-11-06 10:37:42.15	2025-11-06 10:37:42.15	\N	f
smu-luminaire	smu-luminaire	\N	\N	\N	admin	2025-11-06 10:43:35.298	2025-11-06 10:43:35.298	\N	f
org4	mentorme	MentorMe Network — community partner in mentoring.	https://mentorme.sg	62551234	admin	2025-11-06 10:49:28.028	2025-11-06 10:49:28.028	\N	f
org5	green-roots	Green Roots — community partner in environment.	https://greenroots.sg	67895432	admin	2025-11-06 10:49:28.242	2025-11-06 10:49:28.242	\N	f
org6	eldercare-alliance	ElderCare Alliance — community partner in elderly.	https://eldercare.sg	68996543	admin	2025-11-06 10:49:28.464	2025-11-06 10:49:28.464	\N	f
smu-hai-khun	smu-hai-khun	\N	\N	\N	admin	2025-11-06 10:49:36.924	2025-11-06 10:49:36.924	\N	f
smu-sunshine	smu-sunshine	\N	\N	\N	admin	2025-11-06 11:10:29.111	2025-11-06 11:10:29.111	\N	f
bj8h1XxtumdM1ewjgfqNbDXbsgb1bk5J	adrian-s-deployment	ADRIAN'S DEPLOYMENT TEST	https://steamcommunity.com	+6596724702	admin	2025-11-06 14:28:44.601	2025-11-06 14:28:44.601	\N	f
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (user_id, phone, student_id, entry_year, school, skills, interests) FROM stdin;
QvmMspzyQ1EQbCXEtU7iwUWYdLB1IO6Z	\N	\N	2024	\N	{}	{}
stud1	873193965	S1874934	2022	SCIS	{Communication,Creativity}	{Kids,Environment}
stud2	818875709	S3016144	2021	LKCSB	{Teaching,Empathy}	{Education,Children}
stud3	823932098	S5602602	2023	SOSS	{"Program Design",Patience}	{Animals,Community}
stud4	839364783	S8867466	2022	SIS	{Coding}	{Environment,Workshops}
3mCgcAIhcMrGVYoiw5Vtf7y7hc5VYj1X	\N	\N	2023	\N	{}	{}
RqFwxM5UgfSjfSxEfDc8u93FLERyxsqg	\N	\N	2024	\N	{}	{}
nOOgzCWFvcVdbyhvPePkDEes9hcOgWfz	\N	\N	2024	\N	{}	{}
ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	\N	\N	2024	\N	{}	{}
Qmwgl0GSs35ojZoZGE6caVqeudC1TUC7	90733995	01511117	2024	School of Computing and Information Systems (SCIS)	{Communication,Empathy}	{Children}
RxeTOQl93FocGcu99d7wdR2R4sHjIWv3	\N	\N	2024	\N	{}	{}
rrJdiguhR5hHPJgHfam0Xe4xcVr1Kr5r	\N	\N	2024	\N	{}	{}
\.


--
-- Data for Name: project_memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_memberships (project_id, user_id, accepted_at) FROM stdin;
7c3b6a8c-ee7f-4a0a-9cae-f1370819eea6	stud3	2025-11-04 16:30:54.29
21fdb6ef-1604-45c7-82c7-d38b8c0cb02b	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	2025-11-06 09:35:12.189
b8497655-5155-45a2-83e2-a876c9cf15bd	Qmwgl0GSs35ojZoZGE6caVqeudC1TUC7	2025-11-06 11:03:15.442
b8497655-5155-45a2-83e2-a876c9cf15bd	RxeTOQl93FocGcu99d7wdR2R4sHjIWv3	2025-11-06 11:14:46.398
7c3b6a8c-ee7f-4a0a-9cae-f1370819eea6	rrJdiguhR5hHPJgHfam0Xe4xcVr1Kr5r	2025-11-06 11:19:50.996
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (project_id, org_id, title, summary, category, type, country, description, about_provide, about_do, requirements, skill_tags, district, google_maps, latitude, longitude, is_remote, repeat_interval, repeat_unit, days_of_week, time_start, time_end, start_date, end_date, apply_by, slots_total, required_hours, image_url, project_tags, created_at) FROM stdin;
a04e7f52-12af-4be8-989b-63462daf0be2	org2	Virtual Mentoring Program	Mentor youth online in life skills.	Mentoring	local	\N	Guide youth virtually on communication and skills.	Weekly online sessions	Facilitate small groups, 1:1 check-ins	Stable internet, headset	{Communication,Leadership}	Remote		\N	\N	t	1	week	{Wednesday}	18:00:00	20:00:00	2025-11-05 10:00:00	2026-02-05 12:00:00	2025-11-04 15:59:59	30	20	https://images.unsplash.com/photo-1519389950473-47ba0277781c	{Mentoring,Youth}	2025-11-04 16:30:53.527
2ce3a07c-e2ca-44f9-bfbc-4e258d445285	caleb-s-cars	East Side Elderly	Play mahjong with elderly at East side	Elderly	local	\N	Play mahjong with elderly at East side	Play mahjong with elderly at East side	Play mahjong with elderly at East side	Play mahjong with elderly at East side	{Communication,Patience}	Tampines	https://www.google.com/maps/place/Tampines+Central+Community+Club/@1.3539896,103.9343018,1942m/data=!3m2!1e3!5s0x31da1803311c1953:0x5790c654a0e29b95!4m10!1m2!2m1!1stampines+community+centre!3m6!1s0x31da3d725e415c69:0x7fc59eaf0ee2f6c4!8m2!3d1.3532116!4d103.9408654!15sChl0YW1waW5lcyBjb21tdW5pdHkgY2VudHJlWhsiGXRhbXBpbmVzIGNvbW11bml0eSBjZW50cmWSARBjb21tdW5pdHlfY2VudGVymgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU42ZUZCcWJrbG5FQUXgAQD6AQQIABA8!16s%2Fg%2F1hc0w11cs?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D\n	1.3539896	103.9343	f	0	week	{Saturday}	15:00:00	18:00:00	2025-11-30 00:00:00	2025-11-30 00:00:00	2025-11-23 00:00:00	10	3	https://media.istockphoto.com/id/1174949725/photo/everyday-family.jpg?s=612x612&w=0&k=20&c=ypx6qC6JwGkQJU51wBtrtQBHVBEdh_mDN9jkSfrzGLU=	{Elderly}	2025-11-05 18:50:05.443415
5239a800-8ede-4313-b757-297db5146623	caleb-s-cars	IT for Kids	Teach children about technology.	Mentoring	local	\N	Teach children about technology.	Teach children about technology.	Teach children about technology.	Teach children about technology.	{Teaching,Communication,Coding}	Bishan	https://www.google.com/maps/place/Bishan+Community+Club/@1.3497251,103.8481477,871m/data=!3m3!1e3!4b1!5s0x31da1713ff73d1d3:0x1c40ddc7ac439129!4m6!3m5!1s0x31da1713efffffff:0xccc5a9925f9e8659!8m2!3d1.3497251!4d103.8507226!16s%2Fg%2F1ttp_mkh?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.3497251	103.8549	f	2	week	{Monday,Tuesday}	16:00:00	18:30:00	2025-11-23 00:00:00	2025-11-30 00:00:00	2025-11-21 00:00:00	2	5	https://www.learningresources.com/media/wp-content/uploads/2022/tech_cover.jpg	{Children,Technology}	2025-11-05 18:46:02.897504
104f0090-c897-4179-99d6-6845b42d67c6	caleb-s-cars	Sports Living	Play sports at the CC with the underprivileged	Community	local	\N	Play sports at the CC with the underprivileged	Play sports at the CC with the underprivileged	Play sports at the CC with the underprivileged	Play sports at the CC with the underprivileged	{Teaching,Sports}	Ang Mo Kio	https://www.google.com/maps/place/Ang+Mo+Kio+Community+Centre/@1.349725,103.8301229,6965m/data=!3m2!1e3!5s0x31da16de3e497107:0xea997ba1ae834c95!4m10!1m2!2m1!1sang+mo+kio+community+center!3m6!1s0x31da16dee3b03a7b:0x579dbff4910ac888!8m2!3d1.3668579!4d103.8407909!15sChthbmcgbW8ga2lvIGNvbW11bml0eSBjZW50ZXJaHSIbYW5nIG1vIGtpbyBjb21tdW5pdHkgY2VudGVykgEQY29tbXVuaXR5X2NlbnRlcpoBI0NoWkRTVWhOTUc5blMwVkpRMEZuU1VOUGNYTmlXbHBCRUFF4AEA-gEECAAQPw!16s%2Fg%2F1tctc36d?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.3497251	103.830124	f	1	week	{Wednesday}	08:00:00	09:00:00	2025-12-15 00:00:00	2026-01-15 00:00:00	2025-11-30 00:00:00	6	6	https://www.sportshub.com.sg/sites/default/files/2022-08/Story-7-1152x744px-COMPRESSED.jpg	{"Less Privileged"}	2025-11-05 19:00:32.816691
71d084a6-3f01-4309-8289-01fd958b41f5	org2	Career Readiness Workshops	Teach resume writing & interview skills.	Community	local	\N	Online/onsite hybrid workshops for older youths.	Materials & templates	Run activities, review resumes	Comfortable presenting	{Coaching,Facilitation}	Queenstown	https://www.google.com/maps/place/Queenstown+Community+Centre/@1.2988065,103.7989897,871m/data=!3m2!1e3!4b1!4m6!3m5!1s0x100404053dfd9e77:0x11d6b622ea7307c2!8m2!3d1.2988065!4d103.8015646!16s%2Fg%2F1tcxxb9h?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.2988065	103.79899	f	2	week	{Saturday}	10:00:00	13:00:00	2025-11-22 02:00:00	2026-03-14 05:00:00	2025-11-20 15:59:59	20	3	https://images.unsplash.com/photo-1557426272-fc759fdf7a8d	{Workshops}	2025-11-04 16:30:53.527
c58b55d3-3945-43a3-90bb-e9742e7ed6f4	org1	Beach Cleanup Drive	Help clean up East Coast Park beach area.	Environment	local	\N	Join us in cleaning up the beach and preserving marine life.	Gloves, bags, supervision	Pick plastic, sort recyclables, engage with community	Must be > 18	{Empathy,Teamwork}	East Coast Park	https://www.google.com/maps/place/Siglap+South+Community+Centre/@1.2962687,103.7677556,27861m/data=!3m2!1e3!5s0x31da22bbc2159877:0x2114aa3aaf35d274!4m10!1m2!2m1!1seast+coast+community+centre!3m6!1s0x31da22bbc195b707:0x76747a092669e19f!8m2!3d1.3135421!4d103.930667!15sChtlYXN0IGNvYXN0IGNvbW11bml0eSBjZW50cmVaHSIbZWFzdCBjb2FzdCBjb21tdW5pdHkgY2VudHJlkgEQY29tbXVuaXR5X2NlbnRlcpoBI0NoWkRTVWhOTUc5blMwVkpRMEZuU1VOMWQyOUljMFpCRUFF4AEA-gEECAAQQw!16s%2Fg%2F1th54j3s?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.2962687	103.76775	f	1	week	{Saturday}	09:00:00	13:00:00	2025-11-08 01:00:00	2026-01-31 05:00:00	2025-11-05 15:59:59	50	4	https://images.unsplash.com/photo-1581574200745-77f49a9f4f25	{Beach,Cleanup}	2025-11-04 16:30:53.527
f471235f-c366-4cae-a395-a596f49eaf26	org3	Community Pet Adoption Day	Help run adoption drives and speak to public.	Arts & Culture	local	\N	Booths, forms, and match-making for adopters.	Booths, paperwork	Engage visitors, brief care requirements	People-friendly	{Communication}	Toa Payoh	https://www.google.com/maps/place/Toa+Payoh+Central+Community+Club/@1.3347998,103.8328864,3483m/data=!3m2!1e3!5s0x31da1766824cf857:0xf0ab8bba57f9c2b6!4m10!1m2!2m1!1stoa+payoh+community+center!3m6!1s0x31da1761b469b05b:0xd37cb6c882861631!8m2!3d1.3347998!4d103.8503959!15sChp0b2EgcGF5b2ggY29tbXVuaXR5IGNlbnRlclocIhp0b2EgcGF5b2ggY29tbXVuaXR5IGNlbnRlcpIBEGNvbW11bml0eV9jZW50ZXKaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVUlljVTF0Um1wUlJSQULgAQD6AQUI_gIQSA!16s%2Fg%2F11j2zj_t02?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.3347998	103.832886	f	1	month	{Saturday}	11:00:00	16:00:00	2025-11-29 03:00:00	2026-04-26 08:00:00	2025-11-25 15:59:59	25	5	https://images.unsplash.com/photo-1535268647677-300dbf3d78d1	{Adoption,Events}	2025-11-04 16:30:53.527
2a7b2da6-f747-4941-8d4b-406b9291b32c	org1	Recycling Education Booth	Educate the public on recycling best practices.	Community	local	\N	Run booths at malls to engage shoppers.	Booth materials, scripts	Engage, explain, demonstrate sorting	Confident speaking to public	{Communication}	Tampines	https://www.google.com/maps/place/Tampines+Central+Community+Club/@1.3539896,103.9343018,1942m/data=!3m2!1e3!5s0x31da1803311c1953:0x5790c654a0e29b95!4m10!1m2!2m1!1stampines+community+centre!3m6!1s0x31da3d725e415c69:0x7fc59eaf0ee2f6c4!8m2!3d1.3532116!4d103.9408654!15sChl0YW1waW5lcyBjb21tdW5pdHkgY2VudHJlWhsiGXRhbXBpbmVzIGNvbW11bml0eSBjZW50cmWSARBjb21tdW5pdHlfY2VudGVymgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU42ZUZCcWJrbG5FQUXgAQD6AQQIABA8!16s%2Fg%2F1hc0w11cs?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D\n	1.3539896	103.9343	f	1	week	{Saturday,Sunday}	12:00:00	16:00:00	2025-11-15 04:00:00	2026-02-28 08:00:00	2025-11-12 15:59:59	40	4	https://images.unsplash.com/photo-1556761175-5973dc0f32e7	{Education,Recycling}	2025-11-04 16:30:53.527
7c3b6a8c-ee7f-4a0a-9cae-f1370819eea6	org3	Animal Shelter Volunteering	Support dog shelter: walking/feeding/upkeep.	Animal Welfare	local	\N	Onsite shifts with supervision.	Training, safety brief	Clean, feed, walk dogs	Must love animals	{Patience,Empathy}	Pasir Ris	https://www.google.com/maps/place/Pasir+Ris+East+Community+Club/@1.3728309,103.9379607,3483m/data=!3m2!1e3!5s0x31da3dae80d13a13:0x350b81c42d2c8e89!4m10!1m2!2m1!1sPasir+Ris+community+center!3m6!1s0x31da3dad35ec1551:0x8acc856e1bdcc91c!8m2!3d1.3685335!4d103.959445!15sChpQYXNpciBSaXMgY29tbXVuaXR5IGNlbnRlclocIhpwYXNpciByaXMgY29tbXVuaXR5IGNlbnRlcpIBEGNvbW11bml0eV9jZW50ZXKaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUXRhWEl0WjFkbkVBReABAPoBBAgAEDc!16s%2Fg%2F1tdggsgn?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.37283	103.93796	f	1	week	{Sunday}	10:00:00	14:00:00	2025-11-09 02:00:00	2026-01-11 06:00:00	2025-11-07 15:59:59	20	10	https://images.unsplash.com/photo-1517849845537-4d257902454a	{Animals,Shelter}	2025-11-04 16:30:53.527
21fdb6ef-1604-45c7-82c7-d38b8c0cb02b	caleb-s-cars	Meow Movement	Volunteer at a cat cafe	Animal Welfare	local	\N	Volunteer at a cat cafe	Volunteer at a cat cafe	Volunteer at a cat cafe	Volunteer at a cat cafe	{"Pet Care"}	Admiralty	https://www.google.com/maps/place/Admiralty+Vista/@1.4405998,103.7946335,871m/data=!3m2!1e3!5s0x31da1375498ec417:0x21715be6309b6678!4m10!1m2!2m1!1sadmiralty+%2B!3m6!1s0x31da13752cd12827:0x4cc536d94cf9798a!8m2!3d1.4405998!4d103.7990109!15sCgthZG1pcmFsdHkgK5IBEmFwYXJ0bWVudF9idWlsZGluZ-ABAA!16s%2Fg%2F11c5_ysmj5?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.4405998	103.79463	f	1	week	{Monday}	15:00:00	17:00:00	2025-12-07 00:00:00	2025-12-28 00:00:00	2025-11-30 00:00:00	3	6	https://www.epos.com.sg/wp-content/uploads/2022/08/Cat-Cafe-Singapore-Cover-Image-Opt-1024x683.jpg	{Elderly}	2025-11-05 18:57:21.987257
b77534c5-b614-4c2c-8abe-38fe39520b2b	smu-art2heart	Project Art2Heart	Community service project helmed by SMU Arts & Cultural Fraternity (ACF).	Arts & Culture	local	\N	Project Art2Heart is a community service project helmed by SMU Arts & Cultural Fraternity (ACF). The project partners Metropolitan YMCA to improve the mental and physical wellness of seniors in Singapore. Leveraging club members’ talents and expertise in the arts, the project engages seniors through various art forms to help them stay active.	Understand elderly and how to incorporate them to society	Interact with elderly through art activities to improve the mental and physical wellness of elderly in Singapore	Love art and the elderly	{Teaching,Empathy,Art,Creativity}	Bishan	https://www.google.com/maps?s=web&lqi=ChJiaXNoYW4gbXJ0IHN0YXRpb25IyZ-QjICwgIAIWiQQARACGAAYARgCIhJiaXNoYW4gbXJ0IHN0YXRpb24qBAgCEAGSARByYWlsd2F5X3NlcnZpY2VzqgFFCgkvbS8wMjVzcmYQATIeEAEiGsauCQZBKdatnW8ue5mJdFMWC60ZWNzn919zMhYQAiISYmlzaGFuIG1ydCBzdGF0aW9u&vet=12ahUKEwiA6eXIqN2QAxXYd2wGHdy2JsIQ1YkKegQIKhAB..i&cs=0&um=1&ie=UTF-8&fb=1&gl=sg&sa=X&geocode=Ke8bQ5EWF9oxMf6Q9i3NJ1eb&daddr=200+Bishan+Rd,+Singapore+579827	\N	\N	f	1	week	{Monday}	10:30:00	11:30:00	2025-11-17 00:00:00	2025-11-30 00:00:00	2025-11-16 00:00:00	2	10	https://c4sr.smu.edu.sg/sites/c4sr.smu.edu.sg/files/2025-07/x02-LocalCSP-Art2Heart-IMG-20240702-WA0004_0.jpg	{"Mental Health",Art}	2025-11-06 10:30:02.673725
100c593a-24ba-4c6d-8d45-0290131ac4a3	caleb-s-cars	Pawsitive Companions @ SPCA	Support SPCA Singapore by helping care for rescued animals and assisting adoption drives.	Animal Welfare	local	\N	Students will participate in daily kennel cleaning, feeding, and basic grooming of rescued cats and dogs. They’ll also assist with weekend adoption events.	Animal handling and care skills, teamwork, and compassion training.	Clean animal enclosures, prepare food, assist with adoptions, help educate visitors.	Comfortable around animals, physically fit, punctual.	{Communication,Empathy}	Pasir Ris	https://www.google.com/maps/place/SPCA+Singapore/@1.3481756,103.9324965,15z	1.3481756	103.932495	f	2	week	{Tuesday,Saturday}	09:00:00	13:00:00	2025-11-10 00:00:00	2025-12-20 00:00:00	2025-11-09 00:00:00	10	48	https://images.unsplash.com/photo-1592194996308-7b43878e84a6	{animals}	2025-11-06 10:40:52.473026
b8497655-5155-45a2-83e2-a876c9cf15bd	cats-at-yishun	Yishun Cats	These are cats in Yishun	Animal Welfare	local	\N	For cat lovers only!	How to take care of cats 	Love all the cats there	Love cats	{love}	Yishun		\N	\N	f	2	week	{Tuesday,Wednesday}	17:00:00	19:00:00	2025-11-20 00:00:00	2026-02-20 00:00:00	2025-11-19 00:00:00	15	52	https://marketplace.canva.com/8-1Kc/MAGoQJ8-1Kc/1/tl/canva-ginger-cat-with-paws-raised-in-air-MAGoQJ8-1Kc.jpg	{animals}	2025-11-06 10:33:52.207669
43002c14-f233-432f-b572-d698ee5b0f7d	org1	Mangrove Restoration	Plant and restore mangroves in Pasir Ris.	Environment	local	\N	Field restoration, seedling planting, and monitoring.	Boots, tools, training	Planting, tagging, data collection	Comfortable in muddy terrain	{Patience,Carefulness}	Pasir Ris	https://www.google.com/maps/place/Pasir+Ris+East+Community+Club/@1.3728309,103.9379607,3483m/data=!3m2!1e3!5s0x31da3dae80d13a13:0x350b81c42d2c8e89!4m10!1m2!2m1!1sPasir+Ris+community+center!3m6!1s0x31da3dad35ec1551:0x8acc856e1bdcc91c!8m2!3d1.3685335!4d103.959445!15sChpQYXNpciBSaXMgY29tbXVuaXR5IGNlbnRlclocIhpwYXNpciByaXMgY29tbXVuaXR5IGNlbnRlcpIBEGNvbW11bml0eV9jZW50ZXKaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUXRhWEl0WjFkbkVBReABAPoBBAgAEDc!16s%2Fg%2F1tdggsgn?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.3728309	103.93796	f	2	week	{Sunday}	08:00:00	12:00:00	2025-11-09 00:00:00	2026-03-29 04:00:00	2025-11-06 15:59:59	25	4	https://upload.wikimedia.org/wikipedia/commons/7/7b/Mangroves_at_sunset.jpg	{Nature,Forest}	2025-11-04 16:30:53.527
c3331766-1f13-425d-8b8b-bf3297eab939	smu-boribo	Project Boribo	Deliver life skills and vocational IT training to students in Cambodia.	Mentoring	overseas	Cambodia	Project Boribo has reached approximately 300 community members through World Vision Cambodia's Rolea Bier Area Programme and Kampong Svay Area Programme, engaging both students and teachers. This project is supported by Ruth Chiang Overseas Community Service Grant and Youth Expedition Projection (YEP) Grant by Youth Corps Singapore (YCS).	Participants will develop digital literacy skills that are increasingly vital in today's economy, while financial literacy components help families better manage resources and plan for their futures. By working directly with local teachers, the project also builds sustainable capacity within the community, ensuring that knowledge and skills can continue to be shared even after the programme concludes.	The project delivers life skills and vocational IT training to equip students with practical abilities, while also providing financial literacy classes that empower the broader community with essential knowledge for making informed financial decisions.  	NA	{Teaching,Communication,Creativity,"Problem Solving"}			\N	\N	f	1	week	{Monday}	10:00:00	12:30:00	2026-03-02 00:00:00	2026-03-16 00:00:00	2025-12-31 00:00:00	20	8	https://c4sr.smu.edu.sg/sites/c4sr.smu.edu.sg/files/2025-07/OCSP-Banner-19-Boribo2024-photo_19_2024-08-12_21-20-59_2.jpg	{Children,"Less Privileged",Global}	2025-11-06 10:36:16.395284
8747852d-b397-49ef-8d8f-050eab2cb3a0	smu-luminaire	Project Luminaire	Provide solar-powered lights to residents in Sitio Alao, Zambales, Philippines.	Community	overseas	Philippines	In partnership with Liter of Light, Project Luminaire illuminates the lives of light-impoverished communities by providing affordable, sustainable solar-powered pipe lights, streetlights, and house lights to residents in Sitio Alao, Zambales, Philippines. \n\nThe team also teaches community members the fundamentals of building and maintaining these solar-powered lights, enabling them to repair the units independently and ensuring long-term sustainability.	Work with like-minded students to serve a community cause	Beyond lighting infrastructure, students will empower underprivileged children within the community to make informed decisions and expand their learning opportunities. The team enhances Sitio Alao Elementary School's curriculum by incorporating engaging and creative activities that teach essential skills in English literacy, hygiene, and healthcare.	Good to have some understanding of Tagalog	{"Problem Solving",Communication,Creativity,Leadership}			\N	\N	f	1	week	{Wednesday}	08:00:00	11:00:00	2025-12-22 00:00:00	2025-12-29 00:00:00	2025-11-30 00:00:00	30	3	https://c4sr.smu.edu.sg/sites/c4sr.smu.edu.sg/files/2025-07/18-OCSP-C4SR-Luminaire4_Completion-of-street-lamp-installation_0.jpg	{Lights,"Less Privileged",Children}	2025-11-06 10:48:53.098111
4e7c77a1-7588-475f-b35e-89ace2d3af91	org4	Youth Inspire Mentorship	Guide secondary school students in building confidence and future-ready skills.	Mentoring	local	\N	Volunteers mentor small groups through weekly sessions on communication and resilience.	Mentor training and materials.	Facilitate activities, support mentees.	Good communicator.	{Empathy,Leadership}	Ang Mo Kio	https://www.google.com/maps/place/Ang+Mo+Kio+Hub/@1.3692526,103.8493444,17z	\N	\N	f	1	week	{Friday}	15:00:00	17:30:00	2025-11-12 00:00:00	2025-12-19 00:00:00	2025-11-11 00:00:00	20	2	https://images.unsplash.com/photo-1522071820081-009f0129c71c	{youth,leadership}	2025-11-06 10:49:28.475
7596ff93-06d9-4a8e-99a6-01d968ea4922	org4	Read & Lead	Encourage reading habits among underprivileged children.	Mentoring	local	\N	Mentors engage children through storytelling, literacy games, and reading sessions.	Books, worksheets.	Organize reading circles, assist homework.	Fluent in English, patient.	{Storytelling,Patience}	Toa Payoh	https://www.google.com/maps/place/Toa+Payoh+Public+Library/@1.3346,103.8501,15z	\N	\N	f	2	week	{Tuesday,Thursday}	14:00:00	17:00:00	2025-11-20 00:00:00	2026-01-15 00:00:00	2025-11-19 00:00:00	20	3	https://images.unsplash.com/photo-1524995997946-a1c2e315a42f	{education,literacy}	2025-11-06 10:49:28.475
7a94f811-163d-40e9-b1d9-c5366f7cf043	org2	Wildlife Conservation with ACRES	Work with ACRES to promote wildlife rescue and rehabilitation.	Animal Welfare	local	\N	Assist with animal rescue operations and public awareness campaigns.	Training, equipment.	Support rescue hotline, design posters, assist events.	Passion for wildlife.	{Research,Communication}	Choa Chu Kang	https://www.google.com/maps/place/ACRES+Singapore/@1.4032542,103.7475043,15z	\N	\N	f	1	week	{Sunday}	08:30:00	12:30:00	2025-11-20 00:00:00	2026-01-05 00:00:00	2025-11-19 00:00:00	20	4	https://images.unsplash.com/photo-1535930749574-1399327ce78f	{wildlife,education}	2025-11-06 10:49:28.475
b1ad33bb-d801-41d6-b325-8bfbec2d0b8a	org2	Cat Café Happiness Project	Partner with The Cat Café to enhance visitor experience and cat welfare.	Animal Welfare	local	\N	Assist café staff in educating visitors about cat adoption and welfare.	Orientation, materials.	Interact with cats, assist café operations, educate guests.	Friendly, comfortable with cats.	{Patience,Communication}	Bugis	https://www.google.com/maps/place/The+Cat+Cafe/@1.3002512,103.8534363,17z	\N	\N	f	3	week	{Monday,Wednesday,Friday}	10:00:00	14:00:00	2025-11-15 00:00:00	2025-12-31 00:00:00	2025-11-14 00:00:00	25	4	https://images.unsplash.com/photo-1543852786-1cf6624b9987	{cats,welfare}	2025-11-06 10:49:28.475
041ec5b7-df21-4f0b-9993-f4cdb1bfd6a6	org3	Dog Shelter Care Assistant	Join our team to support abandoned and rescued dogs at the community shelter. Help provide daily care, exercise, and socialization for dogs awaiting adoption.	Animal Welfare	local	\N	Our dog shelter houses 20-30 rescued dogs at any given time, ranging from puppies to senior dogs. Volunteers play a crucial role in maintaining the shelter and ensuring each dog receives proper care, attention, and exercise. This is a hands-on role perfect for dog lovers who want to make a real difference in animals' lives.	Complete safety training and dog handling techniques, protective equipment (gloves, aprons), all cleaning supplies and tools, dog care guidelines and best practices, supervision from experienced staff, and refreshments during shifts.	Volunteers will assist with daily shelter operations including feeding dogs, cleaning kennels, providing fresh water, walking dogs for exercise, brushing and grooming, playing with dogs for socialization, and monitoring dog health and behavior. You'll work alongside experienced staff who will guide you through all tasks.	Must love animals and be comfortable around dogs of all sizes. No prior experience required as full training will be provided. Volunteers should be physically capable of handling dogs on leashes and performing cleaning tasks. Commitment to attend scheduled shifts regularly is important.	{Empathy,Communication,Responsibility}	Pasir Ris	https://www.google.com/maps/place/Pasir+Ris+East+Community+Club/@1.3734309,103.9459946,1741m/data=!3m2!1e3!5s0x31da3dae80d13a13:0x350b81c42d2c8e89!4m10!1m2!2m1!1spasiris+community+center!3m6!1s0x31da3dad35ec1551:0x8acc856e1bdcc91c!8m2!3d1.3685335!4d103.959445!15sChpwYXNpciByaXMgY29tbXVuaXR5IGNlbnRlclocIhpwYXNpciByaXMgY29tbXVuaXR5IGNlbnRlcpIBEGNvbW11bml0eV9jZW50ZXKaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUXRhWEl0WjFkbkVBReABAPoBBAgAEDc!16s%2Fg%2F1tdggsgn?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.3734308	103.94599	f	1	week	{Monday}	13:01:00	16:01:00	2025-12-12 00:00:00	2026-02-12 00:00:00	2025-11-30 00:00:00	10	27	https://cassette.sphdigital.com.sg/image/straitstimes/1c5b585fa9110885a7a77fabc29f2b8df867579f8a354b79d61245f75636d1fe	{"Animal Welfare",Wildlife}	2025-11-06 10:41:44.982752
00575c1e-1bcb-45e8-86fc-01377f75e664	smu-du-xing	Project Du Xing	Address the well-being and development of children residing in the Yuxian Yihai Orphanage	Community	overseas	China	Project Du Xing aims to address the well-being, education, and development of children residing in the Yuxian Yihai Orphanage, who are primarily orphans or children without parental care. These children often face unique challenges, including limited emotional support, gaps in educational guidance, and restricted exposure to the broader world. 	Understand the well-being of students globally.	The project seeks to promote health, social bonding, and teamwork through sports and outdoor activities. It also aims to broaden the children's horizons by introducing them to diverse cultures and traditions, while enhancing their language proficiency, boosting confidence in conversations, and improving listening and comprehension skills.	Understand and speak basic Mandarin.	{Communication,Teaching,Mandarin}			\N	\N	f	1	week	{Thursday}	09:00:00	11:00:00	2026-05-04 00:00:00	2026-05-11 00:00:00	2025-12-31 00:00:00	25	2	https://c4sr.smu.edu.sg/sites/c4sr.smu.edu.sg/files/2025-07/12-OCSP-Du-Xing-PDX-LOGO_0.jpg	{Yuxian,"Less Privileged",Children}	2025-11-06 10:42:16.810029
3fe21f79-5bbd-4a7d-abc9-e0588bc7d303	org3	Cat Rescue & Socialization Volunteer	Help rescue and rehabilitate stray cats\n\n	Animal Welfare	local	\N	Cat rescue sanctuary providing safe haven for stray and abandoned cats	Cat handling training, PPE, behavior guides, cleaning supplies, first aid basics, supervision	Cat feeding, litter maintenance, gentle socialization, playing with kittens, medical observations, adoption counseling, area cleaning	Comfortable with cats, patient and gentle, no prior experience needed	{Empathy,Creativity,"Problem Solving"}	Boon Lay	https://www.google.com/maps/place/Boon+Lay+Community+Club/@1.3484558,103.7089217,871m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31da0fc17f9fe03d:0x569cb27562c30f5f!8m2!3d1.3484558!4d103.7114966!16s%2Fg%2F1tf9qbfd?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D	1.3484558	103.70892	f	1	week	{Monday}	14:01:00	18:01:00	2025-12-31 00:00:00	2026-06-09 00:00:00	2025-11-27 00:00:00	10	92	https://marketplace.canva.com/8-1Kc/MAGoQJ8-1Kc/1/tl/canva-ginger-cat-with-paws-raised-in-air-MAGoQJ8-1Kc.jpg	{Environment,Wildlife}	2025-11-06 10:47:29.174521
92bf0598-a8c8-4528-994e-f466673a4931	org2	Pet Adoption Media Team	Join a creative team to promote adoption through media content.	Animal Welfare	local	\N	Students create social media videos and posters to increase adoption awareness.	Canva templates, guidance.	Design posters, edit videos, write captions.	Basic design knowledge.	{Creativity,Editing}	Clementi	https://www.google.com/maps/place/Clementi+Mall/@1.315466,103.7641968,17z	\N	\N	f	2	week	{Wednesday,Saturday}	13:00:00	17:00:00	2025-11-12 00:00:00	2025-12-15 00:00:00	2025-11-11 00:00:00	20	4	https://media.istockphoto.com/id/1468791740/photo/black-couple-love-or-petting-dog-in-animal-shelter-foster-kennel-or-adoption-center-smile.jpg?s=612x612&w=0&k=20&c=RRewE-O27JreZUdRJxJ8uQkY7cNmrLAm7XIIcQVEhvY=	{media,animals}	2025-11-06 10:58:42.856
93b2a99f-375d-4578-b96d-b6b39f53dc1f	org3	Coding Buddies SG	Mentor primary school kids in basic coding and robotics.	mentoring	local	\N	Teach simple coding using Scratch and LEGO robotics kits.	Laptops, kits, guidance.	Conduct coding lessons, assist projects.	Basic coding knowledge.	{Coding,Problem-solving}	Bukit Timah	https://www.google.com/maps/place/Science+Centre+Singapore/@1.3326561,103.7357458,17z	\N	\N	f	2	week	{Wednesday,Saturday}	10:00:00	12:00:00	2025-11-18 00:00:00	2026-01-10 00:00:00	2025-11-17 00:00:00	25	2	https://images.unsplash.com/photo-1581090700227-1e37b190418e	{mentoring,coding}	2025-11-06 10:58:42.856
51103794-b079-42dc-87bb-3c5b7f62388c	org4	Career Compass Mentorship	Guide polytechnic students on career paths and interview preparation.	Mentoring	local	\N	Provide guidance through career-sharing sessions and mock interviews.	Templates, guidance.	Mentor peers, conduct interviews, review resumes.	Prior work experience preferred.	{Mentoring,Communication}	Tampines	https://www.google.com/maps/place/Tampines+Hub/@1.3536,103.9442,15z	\N	\N	f	1	week	{Saturday}	10:00:00	13:00:00	2025-11-22 00:00:00	2026-01-31 00:00:00	2025-11-21 00:00:00	25	3	https://images.unsplash.com/photo-1557426272-fc759fdf7a8d	{career,guidance}	2025-11-06 10:58:42.856
8586cd72-76e1-47b0-b0a7-ce7caaa44d93	org2	Farm Animal Care @ Hay Dairies	Assist with goat feeding and visitor education at Singapore’s only goat farm.	Animal Welfare	local	\N	Volunteers will support feeding routines and guide visitors on sustainable farming practices.	Safety briefing and gear provided.	Feed goats, clean pens, help during guided farm tours.	Physically active, comfortable outdoors.	{Responsibility,Carefulness}	Lim Chu Kang	https://www.google.com/maps/place/Hay+Dairies/@1.4185,103.7397,15z	\N	\N	f	2	week	{Thursday,Sunday}	08:00:00	12:00:00	2025-12-02 00:00:00	2026-02-28 00:00:00	2025-12-01 00:00:00	15	4	https://www.littledayout.com/wp-content/uploads/hay-dairies-13.jpg\n	{farm,education,sustainability}	2025-11-06 10:58:42.856
c55bc74e-bc76-47b2-a9bf-ced128a3ea26	org1	Marine Life Conservation @ S.E.A. Aquarium	Support S.E.A. Aquarium in educational outreach and marine care activities.	Animal Welfare	local	\N	Assist the aquarium team in educating visitors about marine biodiversity and conservation efforts.	Training and volunteer t-shirts provided.	Help with outreach booths, visitor engagement, and aquarium maintenance support.	Friendly, loves marine life.	{Communication,Awareness}	Sentosa	https://www.google.com/maps/place/S.E.A.+Aquarium/@1.2566,103.8215,17z	\N	\N	f	2	week	{Saturday,Sunday}	10:00:00	15:00:00	2025-11-28 00:00:00	2026-03-10 00:00:00	2025-11-27 00:00:00	15	5	https://cassette.sphdigital.com.sg/image/straitstimes/00ff59c6fe1c852b3a12b82e7d6cd74f675f896db27fce7275fe0aa49a1f2b94	{marine,education,ocean}	2025-11-06 10:58:42.856
d8ca7c65-ed51-40b5-ba57-b7b81e34cee3	org2	Therapy Dog Volunteer @ Animal Assisted SG	Join trained therapy dog teams to bring comfort to hospitals and eldercare centres.	Animal Welfare	local	\N	Assist handlers during therapy visits and interact with patients during pet-assisted therapy sessions.	Orientation and safety training with certified handlers.	Accompany therapy dogs, engage with patients, support handlers.	Comfortable around dogs, friendly and empathetic.	{Empathy,Communication}	Novena	https://www.google.com/maps/place/Tan+Tock+Seng+Hospital/@1.3205536,103.8433326,17z	\N	\N	f	1	week	{Sunday}	10:00:00	13:00:00	2025-11-30 00:00:00	2026-02-28 00:00:00	2025-11-29 00:00:00	8	3	https://static.wixstatic.com/media/ec4249_515f5493026e49f1acda65241e9795bd~mv2_d_4032_3024_s_4_2.jpg/v1/fill/w_4032,h_3024,al_c/ec4249_515f5493026e49f1acda65241e9795bd~mv2_d_4032_3024_s_4_2.jpg	{therapy,dogs,community}	2025-11-06 10:58:42.856
012d1eb1-5180-406b-acca-ee41e665096c	org3	MentorMe Overseas Exchange	Support children in rural Cambodia through English and leadership workshops.	Mentoring	overseas	\N	Students conduct English literacy and leadership sessions abroad.	Accommodation, training.	Teach, mentor, design lessons.	Adaptable and open-minded.	{Teaching,Empathy}	Overseas	https://www.google.com/maps/place/Siem+Reap,+Cambodia/@13.3618,103.859,12z	\N	\N	f	5	week	{Monday,Tuesday,Wednesday,Thursday,Friday}	08:30:00	16:30:00	2025-12-10 00:00:00	2025-12-30 00:00:00	2025-12-09 00:00:00	15	8	https://www.nationaldaycalendar.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cg_faces:center%2Cq_auto:eco%2Cw_768/MjExNzg4NTQyMDQzNDk4NDcy/website-feature---international-mentoring-day--january-17.png	{overseas,teaching}	2025-11-06 10:49:28.475
85c21e6c-99d9-43dd-8dde-f9d8299d2777	org2	Wildlife Keeper for a Day @ Singapore Zoo	Experience life as a zookeeper — help feed, clean, and care for wildlife at Singapore Zoo.	Animal Welfare	local	\N	Volunteers will shadow zookeepers and assist with feeding routines and habitat cleaning.	Uniform, gloves, and supervision from zoo staff.	Feed giraffes, clean animal areas, prepare enrichment activities.	Physically fit and loves animals.	{Responsibility,Teamwork}	Mandai	https://www.google.com/maps/place/Singapore+Zoo/@1.404348,103.793022,15z	\N	\N	f	1	week	{Saturday}	08:00:00	12:00:00	2025-11-22 00:00:00	2026-03-15 00:00:00	2025-11-21 00:00:00	12	4	https://www.mandai.com/content/dam/mandai/destination/things-to-do/tours/singapore-zoo/sz-zookeeperforaday-caousel-1200x630.jpg	{zoo,wildlife,experience}	2025-11-06 10:58:42.856
c2f28bf0-49df-41cb-a8c5-3f3bc4619273	smu-hai-khun	Project Hai Khun	Provides quality education to refugee youth in Thailand	Community	overseas	Thailand	Project Hai Khun, launched in 2021, provides quality education to refugee youth in Thailand who cannot access formal schooling due to their citizenship status. 	Teamwork and collaboration in a new environment	The project equips these youths with essential vocational skills, financial literacy, and business management capabilities, empowering them with practical knowledge that opens doors to career opportunities and economic independence.	Have compassion and enjoy teamwork	{Communication,Teamwork}			\N	\N	f	1	week	{Thursday}	10:00:00	12:00:00	2026-12-07 00:00:00	2026-12-14 00:00:00	2026-01-30 00:00:00	15	2	https://c4sr.smu.edu.sg/sites/c4sr.smu.edu.sg/files/2025-07/x20-OCSP-HaikhunB2024-DSC08549edited_0.jpg	{"Less Privileged",Children,Art}	2025-11-06 11:03:30.582988
9aaa172d-e0d0-4c65-840e-9d738578258a	org3	Community Cat Care Outreach	Engage local communities in humane management and care of stray and community cats across Singapore.	Animal Welfare	local	\N	Students will work with experienced caregivers to support feeding, sterilization (TNRM) efforts, and educational programs that promote responsible community cat care.	Understanding of animal population control ethics and methods\nPublic engagement and advocacy experience\nProject management and documentation skills	Assist in TNRM (Trap-Neuter-Return-Manage) coordination\nConduct community education drives\nDocument cat colonies and feeding zones\nSupport logistics during adoption drives	Must be comfortable working outdoors and with animals\nBasic communication and organization skills\nEnthusiasm for animal rights and empathy toward animals	{Communication,Teamwork,Writing}	Ang Mo Kio	https://www.google.com/maps/place/Ang+Mo+Kio+Town+Garden+West/@1.371488,103.8187619,13z/data=!4m10!1m2!2m1!1sang+mo+kio+garden!3m6!1s0x31da16c2db4fbb07:0x5d8ee92428f09033!8m2!3d1.3741468!4d103.8430281!15sChFhbmcgbW8ga2lvIGdhcmRlbloTIhFhbmcgbW8ga2lvIGdhcmRlbpIBBHBhcmuaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUlNlbVI1YkZObkVBReABAPoBBAgAEC4!16s%2Fm%2F0crfsgk?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D	1.371488	103.81876	f	1	week	{Saturday}	10:00:00	16:00:00	2025-11-20 00:00:00	2025-12-20 00:00:00	2025-11-15 00:00:00	10	30	https://upload.wikimedia.org/wikipedia/commons/2/2c/Ang_Mo_Kio_Town_Garden_West_Singapore_-_panoramio.jpg	{Community,Wildlife}	2025-11-06 11:04:43.447749
5b4ac73e-bdb0-4b1d-aa65-bc22d720c0f2	smu-sunshine	Project Sunshine	Improve communication skills and promote physical fitness in Na Xath Primary School, Laos	Mentoring	overseas	Laos	Now in its 15th iteration, Project Sunshine conducts activities at Na Xath Primary School, including English conversation classes to improve communication skills, sports classes to promote physical fitness and competition, and environmental projects such as solar-powered street lamps, waste management programs, and an eco-garden.	Thrive in teamwork in a global environment	Over the years, the team has visited various educational institutes in Laos and has stayed true to their core mission of imparting English knowledge to the children there, through fun and interactive methods. Their beneficiaries initially ranged from only primary school students. However, they have gradually expanded their outreach to secondary school students as well.	Be passionate and eager to learn	{Communication,Empathy,Creativity}			\N	\N	f	1	week	{Tuesday}	10:00:00	11:00:00	2025-12-22 00:00:00	2025-12-29 00:00:00	2025-11-30 00:00:00	20	1	https://c4sr.smu.edu.sg/sites/c4sr.smu.edu.sg/files/2025-07/13-OCSP-Sunshine-IMG_3194.jpg	{"Less Privileged",Children}	2025-11-06 11:19:44.993376
3840fd98-2d2f-4d72-9200-0fbbf5fb80b6	org2	Macaw Enrichment Program @ Bird Paradise	Assist keepers in creating enrichment toys and activities for macaws at Bird Paradise.	Animal Welfare	local	\N	Volunteers will help design parrot enrichment tools, observe behaviors, and document interaction outcomes.	Training by bird specialists and materials provided.	Prepare food puzzles, record bird behaviors, support keeper sessions.	Interest in birds, creative, detail-oriented.	{Creativity,Observation}	Mandai	https://www.google.com/maps/place/Bird+Paradise/@1.4071539,103.7812684,912m	\N	\N	f	2	week	{Wednesday,Saturday}	09:00:00	13:00:00	2025-11-25 00:00:00	2026-01-25 00:00:00	2025-11-24 00:00:00	10	4	https://dam.mediacorp.sg/image/upload/s--Za7wj6L1--/f_auto,q_auto/c_fill,g_auto,h_622,w_830/v1/mediacorp/tdy/image/2023/04/21/20230421_nlx_bird_paradise-8.jpg?itok=Xxv5o4ED	{birds,education,conservation}	2025-11-06 10:58:42.856
09edb447-e9e1-45ad-8de3-9c06f89806ec	org3	Fitness Bootcamp Organising	Students will design, plan, and facilitate a multi-day fitness bootcamp for their peers.	Sports & Leisure	local	\N	Collaborate with trainers and mentors to create exercise routines, set up event logistics, and promote safe, effective practices for holistic health.	Event planning and management skills, \nUnderstanding of fitness routines and injury prevention, \nHands-on experience in motivational leadership	Develop bootcamp schedules and workout modules, \nAssist trainers during sessions, \nManage participant registrations and event setups, \nCollect feedback and analyse engagement	Interest in fitness and teamwork, \nGood communication and time management skills, \nWillingness to learn basic sports science concepts	{Organisation,Teamwork,Communication,Leadership}	Bishan	https://www.google.com/maps/place/Bishan+ActiveSG+Sports+Hall/@1.3553556,103.8482987,17z/data=!3m1!5s0x31da171a1eb4d81b:0x76eb55b17f6675d5!4m6!3m5!1s0x31da171a1eb3b9af:0xc091afc7c28ea623!8m2!3d1.3553556!4d103.8508736!16s%2Fm%2F063yhjs?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D	1.3553556	103.8483	f	1	week	{Friday}	14:00:00	16:00:00	2025-11-24 00:00:00	2025-12-29 00:00:00	2025-11-15 00:00:00	10	10	https://media.timeout.com/images/102150587/750/422/image.jpg	{Fitness,Wellness}	2025-11-06 14:00:14.334975
12a1e8f3-e775-4adc-b9a8-757226595327	org3	Community Wellness Challenge	Launch and facilitate a community-wide wellness challenge that promotes physical activity and healthy living.	Sports & Leisure	local	\N	Students will create challenge activities, set milestones, and use digital platforms for tracking and outreach to engage community members in exercise, nutrition, and wellness.	Social media strategy know-how, \nCommunity organising experience, \nHealth and wellness awareness	Develop challenge themes and activity ideas, \nCoordinate participant engagement and digital tracking, \nPromote via social media and outreach events, \nDocument results and impact stories	Creativity and digital literacy, \nCollaborative spirit, \nInterest in health promotion	{Organisation,Creativity,Marketing}	Toa Payoh	https://www.google.com/maps/place/Toa+Payoh+Hub/@1.3317857,103.847628,17z/data=!3m1!5s0x31d032b7e3221697:0xf72f8d912faa7db3!4m15!1m8!3m7!1s0x31da17c104dbabed:0x4f142cb8e4be097!2sToa+Payoh+Hub!8m2!3d1.3317762!4d103.8475632!10e5!16s%2Fg%2F11nmrnx0pf!3m5!1s0x31da17c104dbabed:0x4f142cb8e4be097!8m2!3d1.3317762!4d103.8475632!16s%2Fg%2F11nmrnx0pf?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D	1.3317857	103.847626	f	2	week	{Wednesday,Saturday}	11:30:00	15:30:00	2025-12-05 00:00:00	2026-02-28 00:00:00	2025-11-20 00:00:00	10	100	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdL7CYRpBH8DijhYLyDrsIulLIi3qPeOj10w&s	{Community,Health}	2025-11-06 15:41:25.916683
a53ee306-aa98-424c-a098-9d403a78dd00	org3	Inclusive Sports Festival	Plan and run a sports festival that welcomes children, seniors, and persons with disabilities.	Sports & Leisure	local	\N	Students will collaborate with organisers to prepare accessible activities, manage inclusive equipment, and foster a supportive environment for all participants.	Skills in event facilitation for diverse needs, \nUnderstanding of adaptive sports, \nLeadership in inclusive initiatives	Plan sports events for diverse groups, \nHelp run activities and ensure accessibility, \nGuide participants and collect feedback	Empathy and communication skills, \nInterest in inclusive engagement, \nWillingness to help with logistics	{Communication,Empathy}	Tampines	https://www.google.com/maps/place/Our+Tampines+Hub/@1.3528162,103.9396416,17z/data=!3m2!4b1!5s0x31da3d11f5d025fb:0xba564ad7696d844d!4m6!3m5!1s0x31da3d1260438dd9:0xb626e72c290a5594!8m2!3d1.3528162!4d103.9396416!16s%2Fg%2F11f4q_86g5?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D	1.3528162	103.939644	f	1	week	{Sunday}	09:00:00	16:50:00	2025-11-16 00:00:00	2026-01-30 00:00:00	2025-11-14 00:00:00	10	86	https://wonderwall.sg/images/default-source/content/dam/wonderwall/images/2022/04/stadium-stories-our-tampines-hub/lead_1920x1080_tampineshub.jpg.jpg?sfvrsn=452ceecb_0	{Children}	2025-11-06 15:46:22.195775
32cb509e-6c13-42f2-8364-d639319d8eee	org3	Student Sports Journalism Team	Cover, document, and promote student sports events through writing, interviews, photography, and video.	Sports & Leisure	local	\N	Students will report on school and community sports by producing articles, social media posts, and photo/video stories for digital platforms.	Journalistic and storytelling skills, \nDigital media experience, \nSports reporting confidence	Attend sports events for coverage, \nConduct interviews and write stories, \nCreate digital content (images/videos), \nManage online platforms	Interest in sports, writing, or media production, \nBasic photography/videography skills preferred, \nResponsible and deadline-oriented	{Writing,Editing,Photography,Teamwork}	Bukit Timah	https://www.google.com/maps/place/Bukit+Panjang+Community+Club/@1.3422502,103.7888768,13z/data=!4m6!3m5!1s0x31da11a6f37b6b25:0xfdbf31d591088870!8m2!3d1.3765799!4d103.770559!16s%2Fg%2F1tf_kthx?entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D	1.3422502	103.78888	f	1	week	{Friday}	13:00:00	17:00:00	2025-11-21 00:00:00	2026-04-30 00:00:00	2025-11-15 00:00:00	10	92	https://www.onepa.gov.sg/-/media/images/outlets/bukit-panjang-cc-2.jpg?h=889&iar=0&w=1333&rev=8372d3faacab460cad6bc88471368790&hash=A851DE129F770F092A8D1A406DC01E58	{"Digital Literacy"}	2025-11-06 15:53:14.218861
\.


--
-- Data for Name: saved_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saved_projects (project_id, user_id, saved_at) FROM stdin;
2a7b2da6-f747-4941-8d4b-406b9291b32c	Qmwgl0GSs35ojZoZGE6caVqeudC1TUC7	2025-11-06 08:15:41.884
2ce3a07c-e2ca-44f9-bfbc-4e258d445285	QvmMspzyQ1EQbCXEtU7iwUWYdLB1IO6Z	2025-11-06 14:35:00.8
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) FROM stdin;
khU1Kp7bX2kpGPctac9ZMGV9jTUcqHDt	2025-11-13 11:44:35.601	CL45Ch3vwdLSNQiqvGHqCpKsAoFhs5my	2025-11-06 11:44:35.601	2025-11-06 11:44:35.601		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7
Efhv3FSAVUbxdVhpdQEhP1r2T1QujjUF	2025-11-11 18:12:45.867	5pjmGwuMJebWy3pLmbryyINgLHlC1b08	2025-11-04 18:12:45.867	2025-11-04 18:12:45.867		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	QvmMspzyQ1EQbCXEtU7iwUWYdLB1IO6Z
q54Do3ZiHXg9MtKQMCbXMZQCrMqVQ2cF	2025-11-12 11:57:44.397	O8kd3Eu0mEg17qktOLFqLDySjoO6tmsx	2025-11-05 11:57:44.397	2025-11-05 11:57:44.397	122.11.212.41	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	3mCgcAIhcMrGVYoiw5Vtf7y7hc5VYj1X
Jza3L5JZaghqQU2Ep4fZsQfReKGn9ZNN	2025-11-12 12:39:53.135	lNWwJBp2C68GzQSPpzid65FpXHUgec9W	2025-11-05 12:39:53.135	2025-11-05 12:39:53.135	122.11.246.151	Mozilla/5.0 (Linux; Android 15; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.7390.122 Mobile Safari/537.36	nOOgzCWFvcVdbyhvPePkDEes9hcOgWfz
gmjRhOoH9QgonA3iOR2iMekcWRKoHR8B	2025-11-13 12:00:42.91	DtQEHICOIkotkxbcqW7ltJlZ1GVBeitU	2025-11-06 12:00:42.91	2025-11-06 12:00:42.91	202.161.35.27	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0	org3
oBTxDuvXXANy2eHtPrdOZhRoWPeRxKS5	2025-11-13 12:58:53.608	hUqde0tGWZXP4WsamrUvkjUMMEmtCa04	2025-11-06 12:58:53.608	2025-11-06 12:58:53.608		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	rrJdiguhR5hHPJgHfam0Xe4xcVr1Kr5r
oXWNP4rLg1IyuVDmmLLn0xaVs1Hs7tTF	2025-11-13 08:06:40.066	HesYAYkyyp3BbOUlqjPApxy7Uq26z1d2	2025-11-06 08:06:40.066	2025-11-06 08:06:40.066			GOmA51zmbr5a4mmUVJpXcWu2Sw0kI8TC
2qBzY2Ap5pblNS0BZhWHU0VwfnbXvWLt	2025-11-12 16:57:46.503	ER8FAnoiuPL3NhGCC5U2u6PYxR1HAwIt	2025-11-05 16:57:46.503	2025-11-05 16:57:46.503			guTai2Fk2LAUHaUpCmZZFJx79rhtNzih
uMqPy4xzI3PGmAZs8jaojF5mFxPaw0WT	2025-11-13 14:19:13.678	ApTQMIbuYzCsNQVdR9rH1d40Tbfkq2Aj	2025-11-06 14:19:13.678	2025-11-06 14:19:13.678	101.127.128.82	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	Qmwgl0GSs35ojZoZGE6caVqeudC1TUC7
1Sqirz3pcaLIoHhRtjmTreBXMOMJPAZT	2025-11-13 14:28:44.619	KtqKNx5UfyPQM7Fl4gM9e1Bb0R7XJrBo	2025-11-06 14:28:44.619	2025-11-06 14:28:44.619			bj8h1XxtumdM1ewjgfqNbDXbsgb1bk5J
nV1Gs7T2Qa9Vr8pFjKBoQhscmf032Km1	2025-11-12 17:11:10.04	TMKFkabcXJvTHvpLN2woHtcDaTG0awQZ	2025-11-05 17:11:10.04	2025-11-05 17:11:10.04			AWtzo41ojhatk16TwCLRDOQ5ish9CEYC
Zk2XIsomL8Nu900xIS4OPjpMF9csCMBM	2025-11-13 14:50:10.914	ttQIuPN3woMvVAihIM4kdYrqHAcL0GXI	2025-11-06 14:50:10.915	2025-11-06 14:50:10.915	202.161.35.27	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	QvmMspzyQ1EQbCXEtU7iwUWYdLB1IO6Z
97cYjgIciya7tyVvqd5XpaWiKL78ETE2	2025-11-13 15:54:46.08	MHGvtiRtMUin0CH9tAZEgRlbiiPTEJdJ	2025-11-06 15:54:46.08	2025-11-06 15:54:46.08		Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	Qmwgl0GSs35ojZoZGE6caVqeudC1TUC7
X8yL3MQjOeDuEjwaIgHhedK9rrEH5tW4	2025-11-07 10:33:37.114	0eLIAE1zoTz1NWRG62xUZF5KrruXGmNl	2025-11-06 10:33:37.114	2025-11-06 10:33:37.114		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	org3
RVBVsiOCsbTkHlDvJT2A9HI7bQnNvJna	2025-11-07 10:58:14.985	savyFerX6FNHAGjBE4ptvGL6pgpWVOGV	2025-11-06 10:58:14.985	2025-11-06 10:58:14.985		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	admin
CBtS1doQ2fT77HZ1Q2YAwKvZ6kXTrcoe	2025-11-12 18:54:29.888	RJ5TgWfDijPr4htBBcWn37O2yImLipZo	2025-11-05 18:54:29.888	2025-11-05 18:54:29.888			tv2J3lJ30vyDEPbqzgLjCIindiAuyId0
eSg9Vp2aH92rLcbVu7Ba9xavVsMCc4HG	2025-11-07 06:37:44.512	LgrwREx9K8AYWBv6guJqEkgzidUx3MNw	2025-11-06 06:37:44.512	2025-11-06 06:37:44.512	202.161.35.27	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	admin
fpqc9OlChycLFsOZ4UZnIg8dEjBh4sed	2025-11-13 08:36:36.52	lZbzpSjd0m12UODnOk6yUAFi1M2aGgaF	2025-11-06 08:36:36.52	2025-11-06 08:36:36.52			rtPadEb81VOt8mvN92XdHsGgPaG7roTV
7aUKpPfLCVcTlu1GzmHoOOARAymQunXo	2025-11-13 08:45:32.141	F8qbv9DBuGsO0bsqsedbcxSU5yJORffi	2025-11-06 08:45:32.141	2025-11-06 08:45:32.141			dAjHKWOxqbj8R50QEa3oA0NBsDnaFKu6
4lpK1vFoJk5fahjjIEpfP2eiedLctpE6	2025-11-13 09:21:41.059	iMfa53mTDvpXkY7yJ6fe0RIlrVfeBJEy	2025-11-06 09:21:41.059	2025-11-06 09:21:41.059			6Kr5a2DttxauHU467C7IYpeG6pJuPrNo
sJze5UCJiOKGFn1Mwx608g9YwblCXBPx	2025-11-07 09:23:33.535	XemhtU8srK55xasICoiU74lmpDx3EIdB	2025-11-06 09:23:33.535	2025-11-06 09:23:33.535		Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	admin
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email, email_verified, image, created_at, updated_at, is_active, account_type) FROM stdin;
QvmMspzyQ1EQbCXEtU7iwUWYdLB1IO6Z	YEO YING HONG ADRIAN _	adrian.yeo.2024@smu.edu.sg	t	https://lh3.googleusercontent.com/a/ACg8ocIOjbfJnpprdJES7Mu7FZV8v1QF0zqg7wN-MKASsesowa1EyQ=s96-c	2025-11-04 16:28:29.476	2025-11-04 16:28:29.489	t	student
admin	Admin	admin@test.com	t	\N	2025-11-04 16:30:52.759	2025-11-04 16:30:52.759	t	admin
org1	Green Singapore	green-singapore@test.com	t	\N	2025-11-04 16:30:52.991	2025-11-04 16:30:52.991	t	organisation
org2	Youth Connect	youth-connect@test.com	t	\N	2025-11-04 16:30:53.175	2025-11-04 16:30:53.175	t	organisation
org3	Paws SG	paws-sg@test.com	t	\N	2025-11-04 16:30:53.348	2025-11-04 16:30:53.348	t	organisation
stud1	Alice Tan	alice.2025@smu.edu.sg	t	\N	2025-11-04 16:30:53.547	2025-11-04 16:30:53.547	t	student
stud2	Ben Lim	ben.2024@smu.edu.sg	t	\N	2025-11-04 16:30:53.722	2025-11-04 16:30:53.722	t	student
stud3	Carmen Ong	carmen.2026@smu.edu.sg	t	\N	2025-11-04 16:30:53.894	2025-11-04 16:30:53.894	t	student
stud4	David Koh	david.2025@smu.edu.sg	t	\N	2025-11-04 16:30:54.071	2025-11-04 16:30:54.071	t	student
3mCgcAIhcMrGVYoiw5Vtf7y7hc5VYj1X	KAUNG NYAN LIN _	nl.kaung.2023@smu.edu.sg	t	https://lh3.googleusercontent.com/a/ACg8ocLibNRwhaoqeVx1yrdxs6oflk9xOQ0evvX5w-tH2MHPaHjMug=s96-c	2025-11-05 11:57:44.372	2025-11-05 11:57:44.377	t	student
RqFwxM5UgfSjfSxEfDc8u93FLERyxsqg	CALYNN ONG YU XIAN _	calynn.ong.2024@smu.edu.sg	t	https://lh3.googleusercontent.com/a/ACg8ocJUS5AbjtX1kKTIMI4SB8cJc9436-boaHoBLSqQuuEIpe-nag=s96-c	2025-11-05 12:33:21.058	2025-11-05 12:33:21.064	t	student
nOOgzCWFvcVdbyhvPePkDEes9hcOgWfz	LOH KAI ZHE _	kaizhe.loh.2024@smu.edu.sg	t	https://lh3.googleusercontent.com/a/ACg8ocIZQYxSHUN9JccKJn4Q7m27937Sdm5J9W_2seGRn9hk3egZsQ=s96-c	2025-11-05 12:39:53.101	2025-11-05 12:39:53.107	t	student
ychU9BNW0oiT5yk8UBBK5Osp65SBuBk7	HUANG XIU NING KARA _	kara.huang.2024@smu.edu.sg	t	https://lh3.googleusercontent.com/a/ACg8ocKeUYbZAzlquEHGwJKby8L-WkZoFRzKclax1RXA6_yjrkta1A=s96-c	2025-11-05 12:50:15.171	2025-11-05 12:50:15.176	t	student
Qmwgl0GSs35ojZoZGE6caVqeudC1TUC7	TAN XING YEE SHERYL _	xy.tan.2024@smu.edu.sg	t	https://lh3.googleusercontent.com/a/ACg8ocKSyZZKNS0JS2t5lxlOj0FQyl8PIFMzf5-MPYJxiPMuAUtPeQ=s96-c	2025-11-05 13:53:04.044	2025-11-05 13:53:04.05	t	student
guTai2Fk2LAUHaUpCmZZFJx79rhtNzih	Matcha Friends	calynnongyx@gmail.com	f	\N	2025-11-05 16:57:46.425	2025-11-05 16:57:46.447	t	organisation
caleb-s-cars	Caleb's Cars	kara@gmail.com	t	\N	2025-11-05 17:07:27.565	2025-11-05 17:07:27.565	t	organisation
AWtzo41ojhatk16TwCLRDOQ5ish9CEYC	Youth Connect	contact@youthconnect.sg	f	\N	2025-11-05 17:11:09.954	2025-11-05 17:11:09.989	t	organisation
bj8h1XxtumdM1ewjgfqNbDXbsgb1bk5J	ADRIAN'S DEPLOYMENT	adrianallinone@gmail.com	f	\N	2025-11-06 14:28:44.539	2025-11-06 14:28:44.582	t	organisation
tv2J3lJ30vyDEPbqzgLjCIindiAuyId0	HELP123	adrianyywork@gmail.com	f	\N	2025-11-05 18:54:29.851	2025-11-05 18:54:29.861	t	organisation
rtPadEb81VOt8mvN92XdHsGgPaG7roTV	organisation1	organisation1@test.com	f	\N	2025-11-06 08:36:36.439	2025-11-06 08:36:36.457	t	organisation
dAjHKWOxqbj8R50QEa3oA0NBsDnaFKu6	organisation 2	organisation2@test.com	f	\N	2025-11-06 08:45:32.032	2025-11-06 08:45:32.067	t	organisation
GOmA51zmbr5a4mmUVJpXcWu2Sw0kI8TC	Centre for Social Responsibility (C4SR)	c4sr@test.com	f	\N	2025-11-06 08:06:39.976	2025-11-06 08:06:39.999	t	organisation
RxeTOQl93FocGcu99d7wdR2R4sHjIWv3	LEO KAI JIE _	kaijie.leo.2024@smu.edu.sg	t	https://lh3.googleusercontent.com/a/ACg8ocLn9Q9xx_BKN5iOw2pD7V6e-oGa9RaIJG2sz1SF_PWsPdau5g=s96-c	2025-11-06 09:13:32.539	2025-11-06 09:13:32.547	t	student
6Kr5a2DttxauHU467C7IYpeG6pJuPrNo	We Love Animals!	kaoarara@gmail.com	f	\N	2025-11-06 09:21:41.018	2025-11-06 09:21:41.03	t	organisation
centre-for-social-responsibility	Centre for Social Responsibility	c4sr@gmail.com	t	\N	2025-11-06 09:59:23.066	2025-11-06 09:59:23.066	t	organisation
smu-rotaract	SMU Rotaract	rotaract@gmail.com	t	\N	2025-11-06 10:07:06.387	2025-11-06 10:07:06.387	t	organisation
rrJdiguhR5hHPJgHfam0Xe4xcVr1Kr5r	JOHN REY VALDELLON PASTORES _	j.pastores.2024@smu.edu.sg	t	https://lh3.googleusercontent.com/a/ACg8ocLqyiNV-hawyvsYWlz1T_T7nMGVbj5HriDY84X9zME3Lrd7-A=s96-c	2025-11-06 10:07:25.602	2025-11-06 10:07:25.62	t	student
smu-kidleidoscope	SMU Kidleidoscope	kidleidoscope@gmail.com	t	\N	2025-11-06 10:07:37.773	2025-11-06 10:07:37.773	t	organisation
smu-art2heart	SMU Art2Heart	art2heart@gmail.com	t	\N	2025-11-06 10:17:09.086	2025-11-06 10:17:09.086	t	organisation
smu-artis	SMU Artis	artis@gmail.com	t	\N	2025-11-06 10:17:37.938	2025-11-06 10:17:37.938	t	organisation
smu-inspirar	SMU Inspirar	inspirar@test.com	t	\N	2025-11-06 10:18:25.835	2025-11-06 10:18:25.835	t	organisation
starringsmu	starringSMU	starringsmu@test.com	t	\N	2025-11-06 10:18:50.43	2025-11-06 10:18:50.43	t	organisation
world-wide-fund-for-nature	World Wide Fund for Nature	wwr@test.com	t	\N	2025-11-06 10:19:17.566	2025-11-06 10:19:17.566	t	organisation
cats-at-yishun	Cats at Yishun	catmeows@gmail.com	t	\N	2025-11-06 10:28:37.429	2025-11-06 10:28:37.429	t	organisation
smu-boribo	SMU Boribo	boribo@gmail.com	t	\N	2025-11-06 10:32:30.397	2025-11-06 10:32:30.397	t	organisation
smu-du-xing	SMU Du Xing	duxing@gmail.com	t	\N	2025-11-06 10:37:42.15	2025-11-06 10:37:42.15	t	organisation
smu-luminaire	SMU Luminaire	luminaire@test.com	t	\N	2025-11-06 10:43:35.298	2025-11-06 10:43:35.298	t	organisation
org4	MentorMe Network	mentorme@test.com	t	\N	2025-11-06 10:49:27.814	2025-11-06 10:49:27.814	t	organisation
org5	Green Roots	green-roots@test.com	t	\N	2025-11-06 10:49:28.04	2025-11-06 10:49:28.04	t	organisation
org6	ElderCare Alliance	eldercare-alliance@test.com	t	\N	2025-11-06 10:49:28.254	2025-11-06 10:49:28.254	t	organisation
smu-hai-khun	SMU Hai Khun	haikhun@gmail.com	t	\N	2025-11-06 10:49:36.924	2025-11-06 10:49:36.924	t	organisation
smu-sunshine	SMU Sunshine	smusunshine@gmail.com	t	\N	2025-11-06 11:10:29.111	2025-11-06 11:10:29.111	t	organisation
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification (id, identifier, value, expires_at, created_at, updated_at) FROM stdin;
YMahDEEJuhoFTM6kD4Jt7nG4oJDhRnGE	reset-password:R0oDJMaJCDvg4vW6uM8TdSWy	bj8h1XxtumdM1ewjgfqNbDXbsgb1bk5J	2025-11-06 16:31:27.043	2025-11-06 15:31:27.043	2025-11-06 15:31:27.043
\.


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_id_seq', 22, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: organisation_requests organisation_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_requests
    ADD CONSTRAINT organisation_requests_pkey PRIMARY KEY (id);


--
-- Name: organisation_requests organisation_requests_requester_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_requests
    ADD CONSTRAINT organisation_requests_requester_email_unique UNIQUE (requester_email);


--
-- Name: organisations organisations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_pkey PRIMARY KEY (user_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);


--
-- Name: project_memberships project_memberships_project_id_user_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_memberships
    ADD CONSTRAINT project_memberships_project_id_user_id_pk PRIMARY KEY (project_id, user_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: saved_projects saved_projects_project_id_user_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_projects
    ADD CONSTRAINT saved_projects_project_id_user_id_pk PRIMARY KEY (project_id, user_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_token_unique UNIQUE (token);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: apps_project_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX apps_project_idx ON public.applications USING btree (project_id);


--
-- Name: apps_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX apps_user_idx ON public.applications USING btree (user_id);


--
-- Name: org_created_by_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX org_created_by_idx ON public.organisations USING btree (created_by);


--
-- Name: org_requests_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX org_requests_email_idx ON public.organisation_requests USING btree (requester_email);


--
-- Name: org_requests_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX org_requests_status_idx ON public.organisation_requests USING btree (status);


--
-- Name: org_slug_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX org_slug_unique ON public.organisations USING btree (slug);


--
-- Name: org_user_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX org_user_unique ON public.organisations USING btree (user_id);


--
-- Name: profiles_student_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX profiles_student_id_unique ON public.profiles USING btree (student_id);


--
-- Name: proj_memberships_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX proj_memberships_user_idx ON public.project_memberships USING btree (user_id);


--
-- Name: saved_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX saved_user_idx ON public.saved_projects USING btree (user_id);


--
-- Name: uniq_applicant_project; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_applicant_project ON public.applications USING btree (project_id, user_id);


--
-- Name: account account_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: applications applications_project_id_projects_project_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_project_id_projects_project_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE;


--
-- Name: applications applications_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: notifications notifications_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: organisation_requests organisation_requests_decided_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisation_requests
    ADD CONSTRAINT organisation_requests_decided_by_user_id_fk FOREIGN KEY (decided_by) REFERENCES public."user"(id);


--
-- Name: organisations organisations_created_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_created_by_user_id_fk FOREIGN KEY (created_by) REFERENCES public."user"(id);


--
-- Name: organisations organisations_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organisations
    ADD CONSTRAINT organisations_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: profiles profiles_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: project_memberships project_memberships_project_id_projects_project_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_memberships
    ADD CONSTRAINT project_memberships_project_id_projects_project_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE;


--
-- Name: project_memberships project_memberships_user_id_profiles_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_memberships
    ADD CONSTRAINT project_memberships_user_id_profiles_user_id_fk FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;


--
-- Name: projects projects_org_id_organisations_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_org_id_organisations_user_id_fk FOREIGN KEY (org_id) REFERENCES public.organisations(user_id);


--
-- Name: saved_projects saved_projects_project_id_projects_project_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_projects
    ADD CONSTRAINT saved_projects_project_id_projects_project_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE;


--
-- Name: saved_projects saved_projects_user_id_profiles_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_projects
    ADD CONSTRAINT saved_projects_user_id_profiles_user_id_fk FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);


--
-- Name: session session_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Jp4Z8oGFIPrVTMxD0csYB8KaZD5eKERUieiPQI1xeTrZ04UkMaFlDMZMbR6XEXC

