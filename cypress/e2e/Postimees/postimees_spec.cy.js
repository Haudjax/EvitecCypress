/// <reference types="cypress" />

describe("Browsing Postimees website", () => {

    beforeEach(() => {
        //Before each test enter the website and accept with the cookies
        cy.visit("https://news.postimees.ee")
        cy.get(':nth-child(3) > .button').click()
    });


    it("User Can Reach the Landing Page", () => {
        cy.get('.menu-item--active > .menu-item').contains("News")
    });

    it("Can Switch to Estonian From Categories", () => {
        //Click on the link "Eesti keeles" in the main menu bar
        cy.get('.menu-items > :nth-child(2) > .menu-item').click()
        cy.get('.menu-items__left > .menu-item--container > .menu-item').contains("Kõik uudised")
    });

    it("User Can Click on the Featured Article", () => {
        let featuredtitle
        //Save the title of the featured article
        cy.get('.structured-content__group--1 > .structured-content__block > .list-article--1 > .list-article__url > .list-article__text > .list-article__text-content > .list-article__headline')
            .invoke('text')
            .then((text) => {
                featuredtitle = text
            })
        cy.get('.structured-content__group--1 > .structured-content__block > .list-article--1 > .list-article__url').click();
        
        //Compare featured article to the clicked article
        cy.get('.article__headline').invoke("text").then((clickedtitle) => {
            expect(clickedtitle).to.equal(featuredtitle)
        });
    });

    it("Search by Date is Working", () => {
        //Enter Today's date
        const date_today = "03.06.2023"

        //Heading to the search page
        cy.get('.header__actions > a').click()

        //Configuring search options
        cy.get('.option--period > .option__label > .option__label--text').click()
        cy.get('.option__content > :nth-child(1) > label').click()
        cy.get('.button--date-search').click()

        //Running through the whole article container to check the dates
        cy.get('div[class ="structured-content__block structured-content__block--column"]')
        .find('.list-article > .list-article__url >  .list-article__date')
        .each(($article) => {
            cy.wrap($article).should('have.text', date_today);
        });
    });

    it("Search Shows Only English Articles", () => {
        //Heading to the search page
        cy.get('.header__actions > a').click()

        //Configuring search options
        cy.get('.option--sections > .option__label > .option__label--text').click()
        cy.get('.option__content > :nth-child(3) > :nth-child(2)').click()
        cy.get('.option__content > :nth-child(4) > :nth-child(2)').click()
        cy.get('.input-sumbit').click()

        //Running through the whole article container to check for English news
        cy.get('div[class ="structured-content__block structured-content__block--column"]')
        .find('.list-article > .list-article__url > .list-article__text > .list-article__meta > .list-article__meta--left-side > .list-article__section-label')
        .each(($article) => {
            cy.wrap($article).should('have.text', 'Estonian news');
        });
    });

});