drop database if exists appDIAD;
create database if not exists appDIAD;
use appDIAD;

create table users(
id_user int auto_increment primary key,
nom_usuari varchar(25),
nom_complet varchar(40),
pass varchar(15),
img blob
);

create table professors(
id_profe int primary key,
departament varchar(20),
foreign key (id_profe) references users (id_user)
);

create table alumnes(
id_alumne int primary key,
repetidor boolean,
curs int,
foreign key (id_alumne) references users (id_user)
);

create table assignatures(
id_assig int auto_increment primary key,
codi varchar(3),
nom varchar(250),
hores int,
modul varchar(10),
curs int
);

create table docencia(
id_profe int,
id_alumne int,
id_assig int,
nota float,
foreign key (id_profe) references professors (id_profe),
foreign key (id_alumne) references alumnes (id_alumne),
foreign key (id_assig) references assignatures (id_assig),
primary key (id_alumne,id_assig)
);

create table sms(
id_sms int auto_increment,
emisor int,
receptor int,
sms varchar(250),
img varchar(250),
foreign key (emisor) references users (id_user),
foreign key (receptor) references users (id_user),
primary key(id_sms, emisor)
);

INSERT INTO `users` (`nom_usuari`,`nom_complet`,`pass`) VALUES 
("Quon","Lucy Cruz","SKH76KOD3FB"),
("Silas","Petra Gamble","JFU88RUM7JT"),
("Eliana","Paki Christensen","OLZ84TPF6GX"),
("Kennan","Ray Potter","PRH75PWQ4XY"),
("Sophia","Moana Walsh","IBX13RMR4FC"),
("Melissa","Melanie Solomon","YSP78OJU4EH");

INSERT INTO `professors` (`id_profe`,`departament`) VALUES 
("1","Informatica"),
("2","Angles");

INSERT INTO `alumnes` (`id_alumne`,`repetidor`,`curs`) VALUES
(3,false,1), 
(4,false,2),
(5,true,2),
(6,false,2);

INSERT INTO `assignatures` (`codi`,`nom`,`hores`, `modul`, `curs`) VALUES
("AD","Acces a dades",5,"DAM",2),
("DI","Dissey d'interficies",6,"DAM",2),
("PRG","Programació",5,"DAM",1),
("LMI","Llenguatge de marques",4,"ASIX",1);

INSERT INTO `docencia` (`id_profe`,`id_alumne`,`id_assig`, `nota`) VALUES
(1,3,1,5),
(1,4,2,8),
(1,5,3,4),
(1,6,4,6);