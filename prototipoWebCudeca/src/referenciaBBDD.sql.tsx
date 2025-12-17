-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.certificadodonacion (
  donacion_id integer NOT NULL,
  codigovalidacion character varying,
  notificacion_id integer NOT NULL,
  CONSTRAINT certificadodonacion_pkey PRIMARY KEY (donacion_id),
  CONSTRAINT certdon_donacion_fk FOREIGN KEY (donacion_id) REFERENCES public.donacion(id),
  CONSTRAINT certdon_notificacion_fk FOREIGN KEY (notificacion_id) REFERENCES public.notificacion(id)
);
CREATE TABLE public.codigoqr (
  entrada_id integer NOT NULL,
  codigo character varying NOT NULL UNIQUE,
  CONSTRAINT codigoqr_pkey PRIMARY KEY (entrada_id),
  CONSTRAINT codigoqr_entrada_fk FOREIGN KEY (entrada_id) REFERENCES public.entrada(id)
);
CREATE TABLE public.compra (
  id integer NOT NULL,
  fechacompra timestamp without time zone NOT NULL,
  cantidadentradas integer NOT NULL,
  precioentrada numeric NOT NULL,
  totalcompra numeric NOT NULL,
  usuario_id integer,
  evento_id integer NOT NULL,
  pago_id bigint,
  CONSTRAINT compra_pkey PRIMARY KEY (id),
  CONSTRAINT compra_evento_fk FOREIGN KEY (evento_id) REFERENCES public.evento(id),
  CONSTRAINT compra_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.usuario(id),
  CONSTRAINT compra_pago_id_fkey FOREIGN KEY (pago_id) REFERENCES public.pago(id)
);
CREATE TABLE public.donacion (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  cantidad integer NOT NULL,
  fecha timestamp without time zone NOT NULL,
  usuario_id integer NOT NULL,
  evento_id integer,
  CONSTRAINT donacion_pkey PRIMARY KEY (id),
  CONSTRAINT donacion_evento_fk FOREIGN KEY (evento_id) REFERENCES public.evento(id),
  CONSTRAINT donacion_usuariodonante_fk FOREIGN KEY (usuario_id) REFERENCES public.usuario(id)
);
CREATE TABLE public.entrada (
  id integer NOT NULL,
  zona integer NOT NULL,
  fila integer NOT NULL,
  asiento integer NOT NULL,
  precio numeric NOT NULL,
  evento_id integer NOT NULL,
  usuario_id integer NOT NULL,
  compra_id integer NOT NULL,
  CONSTRAINT entrada_pkey PRIMARY KEY (id),
  CONSTRAINT entrada_compra_fk FOREIGN KEY (compra_id) REFERENCES public.compra(id),
  CONSTRAINT entrada_evento_fk FOREIGN KEY (evento_id) REFERENCES public.evento(id),
  CONSTRAINT entrada_usuariocomprador_fk FOREIGN KEY (usuario_id) REFERENCES public.usuario(id)
);
CREATE TABLE public.evento (
  id integer NOT NULL,
  nombre character varying NOT NULL,
  fecha timestamp without time zone NOT NULL,
  ubicacion character varying,
  aforo integer NOT NULL,
  recaudacionactual numeric,
  objetivorecaudacion numeric,
  tipoevento character varying NOT NULL,
  estadoevento character varying,
  entradas integer NOT NULL,
  imageurl character varying,
  precioentrada numeric NOT NULL,
  descripcion character varying,
  rafflenumbers jsonb,
  configuracion_entradas jsonb,
  CONSTRAINT evento_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notificacion (
  id integer NOT NULL,
  mensaje character varying NOT NULL,
  fechaenvio timestamp without time zone NOT NULL,
  evento_id integer NOT NULL,
  usuario_id integer NOT NULL,
  CONSTRAINT notificacion_pkey PRIMARY KEY (id),
  CONSTRAINT notificacion_evento_fk FOREIGN KEY (evento_id) REFERENCES public.evento(id),
  CONSTRAINT notificacion_usuario_fk FOREIGN KEY (usuario_id) REFERENCES public.usuario(id)
);
CREATE TABLE public.pago (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuario_id bigint,
  metodo text NOT NULL,
  tarjeta_numero text,
  titular text,
  expiracion text,
  cvv text,
  email_pago text,
  telefono text,
  ciudad text,
  codigopostal text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pago_pkey PRIMARY KEY (id),
  CONSTRAINT pago_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id)
);
CREATE TABLE public.usuario (
  id integer NOT NULL,
  nombre character varying NOT NULL,
  apellidos character varying NOT NULL,
  dni character varying UNIQUE,
  email character varying UNIQUE,
  codigopostal character varying,
  telefono character varying,
  socio boolean NOT NULL,
  direccion character varying,
  fechanacimiento timestamp without time zone NOT NULL,
  admin boolean NOT NULL,
  password character varying NOT NULL,
  monedero numeric NOT NULL DEFAULT '0'::numeric,
  CONSTRAINT usuario_pkey PRIMARY KEY (id)
);
CREATE TABLE public.voluntario (
  id integer NOT NULL,
  tareasasignadas character varying,
  evento_id integer NOT NULL,
  usuario_id integer NOT NULL,
  CONSTRAINT voluntario_pkey PRIMARY KEY (id),
  CONSTRAINT vol_even_fk FOREIGN KEY (evento_id) REFERENCES public.evento(id),
  CONSTRAINT vol_usu_fk FOREIGN KEY (usuario_id) REFERENCES public.usuario(id)
);