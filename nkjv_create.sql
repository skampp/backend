create table nkjv (
ID serial primary key,
Reference varchar(15),
refFixed varchar(15),
refBook varchar(5),
refBookNum integer,
refChapter integer,
refVerse integer,
Verse text
);