/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */
var FACTS = [
    "Stan Lee who worked for Marvel as a writer for hire sued Marvel in 2005 because he was hurt by Marvel Comics’ decision to keep profits from him over his 60 years with the company.",
    "In the early 1990’s, Michael Jackson tried to buy Marvel Comics just so that he could play Spider Man in his own produced movie.",
    "Due to strange laws in USA, importing toys resembling humans are taxed higher than those that don’t. Marvel successfully argued in court that because their X-men action figures are mutants and therefore should be exempt from such higher tax..",
    "There was a 1995 issue of Punisher called The Punisher Kills The Marvel Universe in which he killed every single Marvel superhero and villain, including himself.",
    "Venom, the Spider-Man villain was a fan-based concept that Marvel bought for $220.",
    "During the production of the Avengers movie, they couldn’t get the Hulk’s roar to sound just right; so they decided to supplement it with recordings of Lou Ferrigno bellowing as the original Hulk.",
    "There is a Marvel super hero called Squirrel Girl, who once beat Doctor Doom by flooding his aircraft with a swarm of squirrels.",
    "In 2002, a 4-year-old boy suffering from hearing loss didn’t want to wear a hearing aid because 'Super heroes don’t.' To get him to wear his hearing aids, Marvel Comics created a super hero with a hearing aid,  Blue Ear.",
    "Marvel has a superhero named Throg. He is a frog that has the power of Thor and is in a superhero group called the Pet Avengers.",
    "In 1983, Marvel published a comic about 'Your friendly neighborhood Spider-Ham'. He was a 'Spider-Pig' named Peter-Porker.",
    "In 1996, Marvel and DC comics created Amalgam Comics that joined their two universes together, thus resulting in characters such as Darkclaw (Batman/Wolverine), Super Soldier (Superman/Captain America), and Iron Lantern (Green Lantern/Iron Man).",
    "There is a Marvel Character called Asbestos Lady, who robbed banks with her accomplices, who (like her) all wore asbestos lined clothing. She later died of cancer.",
    "In the 1970s, Planned Parenthood teamed up with Marvel Comics to release the strangest Spiderman comic that discouraged teens from having unprotected sex.",
    "Apart from writing for Marvel, Stan Lee also wrote 15 DC comics, reimagined popular superheroes like Batman and Superman.",
    "When the character of Nick Fury was re-introduced into the Ultimate Marvel comics, he was redesigned to resemble Samuel L Jackson, without the actor’s permission to use his image. It wasn’t until Samuel himself saw his resemblance in the comic that he contacted Marvel to secure a role in any future Marvel movies.",
    "Marvel’s Deadpool (Wade Wilson) was originally created as a spoof of DC’s Deathstroke (Slade Wilson).",
    "Mr. Immortal is a Marvel character with no special powers except immortality. He has been killed in ways including shot, suffocated, stabbed, drowned, crushed, starved, dehydrated, exploded, poisoned, decapitated, irradiated and incinerated.",
    "There is a fictional company in the Marvel universe called “Damage Control”. It specializes in cleaning up the mess that superheroes and super villains leave behind. ",
    "The reason Spider-Man wasn’t a part of the Avengers movie is because Marvel sold the rights to Sony.",
    "Spider-man married Mary Jane in 1987, for which Marvel held a publicity event featuring actors dressed like Spider-Man and Mary Jane getting married in Shea Stadium.",
    "Eminem is a character in the Marvel universe. ",
    "From 1975 to 1996, Marvel had trademarked the word, “zombies”. Perhaps understanding that this trademark wasn’t enforceable, in 1996 they registered Marvel Zombies.",
    "'Deadpool' has regularly broken the fourth wall. (He knew that he was in comic books). This was due to his 'Comic Awareness,' which was a pun about Captain Marvel’s 'Cosmic Awareness'. ",
    "Despite all the Gods that roam the universe, Marvel Universe lived under one true God called One-Above-All. ",
    "Eleven days before the 9/11 attacks, a character named Jihad was introduced into the Marvel Universe. He was a character, who was bent on world conquest. ",
    "Iron Man was created by Stan Lee as a challenge to create a hero that no one should like and force people to like him. ",
    "In 2003, Marvel Comics announced it was planning to publish a five-part series entitled ‘Di Another Day’ featuring a resurrected Diana (The Princess of Wales), as a mutant with superpowers.",
    "Darth Vader was inspired by Marvel’s Dr. Doom. ",
    "The spider that bites Tobey Maguire in ‘Spider-Man’ was chosen after a 'Spider Olympics,' and was then painted with body paint when time didn’t allow for a spider costume to be created. ",
    "Marvel created a character named Irene Adler (after the Sherlock Holmes’ character), who was supposed to be Mystique’s lover. Marvel wasn’t allowed to portray a gay relationship, so they made them to be friends, but later announced that they were a couple."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Fact = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Fact.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Fact.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say tell me a space fact, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    var factIndex = Math.floor(Math.random() * FACTS.length);
    var randomFact = FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your fact: " + randomFact;
    var cardTitle = "Your Fact";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var fact = new Fact();
    fact.execute(event, context);
};
