
--Populated 

CREATE TABLE Tags(
    tag TEXT NOT NULL
);

insert into Tags (`tag`) VALUEs ('board game');
insert into Tags (`tag`) VALUEs ('drinking game');
insert into Tags (`tag`) VALUEs ('21+');
insert into Tags (`tag`) VALUEs ('fun');
insert into Tags (`tag`) VALUEs ('info session');
insert into Tags (`tag`) VALUEs ('career fair');
insert into Tags (`tag`) VALUEs ('hackathon');
insert into Tags (`tag`) VALUEs ('chill');
insert into Tags (`tag`) VALUEs ('life changing');
insert into Tags (`tag`) VALUEs ('Cry');
insert into Tags (`tag`) VALUEs ('pumpkin drop');
insert into Tags (`tag`) VALUEs ('18+');
insert into Tags (`tag`) VALUEs ('stargaze');
insert into Tags (`tag`) VALUEs ('midterm');
insert into Tags (`tag`) VALUEs ('final exam');
insert into Tags (`tag`) VALUEs ('daily stand up');
insert into Tags (`tag`) VALUEs ('Uno');


CREATE TABLE Events(
    EventID VARCHAR(50) NOT NULL,
    Eventname TEXT NOT NULL,
    Tags TEXT NOT NULL,
    Hostname VARCHAR(20) NOT NULL,
    Hostemail VARCHAR(50) NOT NULL,
    Startdate datetime NOT NULL,
    Enddate datetime,
    Private boolean NOT NULL,
    Description TEXT,
    FlyerURL TEXT,
    Attendees TEXT,
    Forum TEXT,
    primary key (EventID)
);

insert into Events VALUEs ('000','Hard Hack', '["career fair","projects"]', 'korkmaz', 'korkmaz@ucsd.edu', '2020-02-02 12:00:00', NULL, false, 'Come out and build awesome projects over 24 hours using Hardware we provide (You can bring your own parts if you want just make sure they are not complete projects)! Participation is free and food will be provided!!', NULL, 'korkmaz', NULL);
insert into Events VALUEs ('001','John Birthday', '["board game"]', 'john21', 'john21@ucsd.edu','2019-11-02 17:00:00', '2019-11-02 23:00:00', True, 'Happy birthday to John!', 'www.facebook.com', NULL, 'Good Morning, 2019-11-02 18:21:00');
insert into Events VALUEs ('002','Appfolio', '["info session"]', 'KHesung','k3hesung@ucsd.edu', '2020-01-02 13:30:00', NULL, false, NULL, 'http://appfolio.com/', NULL, 'The Event is going to start soon, 2020-01-02 09:21:00');
insert into Events VALUEs ('003','Spring Career', '["career fair"]', 'khosla', 'khsolaaaaaaa@ucsd.edu', '2020-02-15 12:00:00', NULL, false, 'Annual Career Fair in the Srping', NULL, NULL, NULL);
insert into Events VALUEs ('004','National Coockie Day', '["pumpkin drop"]', 'UCSD','ucsd@ucsd.edu', '2020-12-04 12:00:00', NULL, false, NULL, NULL, NULL, 'The Event is going to start soon, 2019-12-04 09:21:00; Do we get free coockies 2019-12-04 09:30:00');
insert into Events VALUEs ('005','Triple Delta', '["21+","18+","drinking","music"]', 'DDD', 'tridelta@ucsd.edu','2019-11-05 12:00:00', NULL, false, 'alsjd aodfuh diviwe ivebf oeefbiwend ifvn qofn sdionousb odbehf ovniwuhof odfivn 0fnjh nh iu dfjv i v h', NULL, NULL, NULL);
insert into Events VALUEs ('006','OMNIA', '["21+","18+","rave"]', 'poiuq023','poiuq023@ucsd.edu', '2020-01-01 22:00:00', NULL, false, 'DANCE DANCE DANCE', NULL, NULL, "No Change!!! 2020-01-01 00:00:00");
insert into Events VALUES ('007','BEACON Daily Meeting', '["daily standup"]', 'dlam002', 'dlam002@ucsd.edu', '2019-11-10 10:00:00', '2019-11-10 12:00:00', True, 'Code', 'https://github.com/Beacon-UCSD', NULL, NULL);
insert into Events VALUES ('010','AWS RDS Test', '["daily standup"]', 'danlam01', 'danlam01@ucsd.edu', '2019-11-11 10:00:00', '2019-11-17 10:00:00', False, 'Code', 'https://github.com/Beacon-UCSD', NULL, NULL);


CREATE TABLE PastEvents(
    EventID VARCHAR(50) NOT NULL,
    Eventname TEXT NOT NULL,
    Tags TEXT NOT NULL,
    Hostname VARCHAR(20) NOT NULL,
    Hostemail VARCHAR(50) NOT NULL,
    Startdate datetime NOT NULL,
    Enddate datetime,
    Private boolean NOT NULL,
    Description TEXT,
    FlyerURL TEXT,
    Attendees TEXT,
    Forum TEXT,
    primary key (EventID)
);

insert into PastEvents VALUES ('aaa','AWS Account Test', '["daily standup"]', 'Dan Lam','dlam002@ucsd.edu', '2018-11-11 10:00:00', '2018-11-17 10:00:00', False, 'Code', 'https://github.com/Beacon-UCSD', NULL, NULL);

CREATE TABLE Users(
    UserID INT(10) AUTO_INCREMENT PRIMARY KEY,
    GoogleUID VARCHAR(50) NOT NULL,
    Username VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    ProfileImage TEXT DEFAULT NULL,
    Phone VARCHAR(20),
    Tags JSON DEFAULT NULL,
    College VARCHAR(20),
    Major VARCHAR(50),
    Year VARCHAR(10),
    Friends TEXT,
    Hostevents TEXT,
    Notification TEXT,
    RegisteredTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users VALUES (1, 'tester.no-token', 'Tester 1', 'tester1@ucsdsocial.club', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP);
INSERT INTO Users VALUES (2, 'tester.no-token', 'Tester 2', 'tester2@ucsdsocial.club', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP);
ALTER TABLE Users AUTO_INCREMENT=3;
