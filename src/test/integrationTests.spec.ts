import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { NoLogger } from "../app/logging/noLogger";
import { TimeSpansInMilliSeconds } from "../app/utils/timespans";
import { ResilientWebPipelineBuilder } from "../app/resilientWebPipelineBuilder";
import { ITokenProvider } from "../app/contracts/tokenProvider";
import { AzureActiveDirectoryAppRegistrationTokenProvider } from "../app/tokenCache/azureAdAppRegistrationTokenProvider";
import { ConsoleLogger } from "../app/logging/consoleLogger";
import { DefaultTokenCache } from "../app/tokenCache/defaultTokenCache";
import { Person } from "./person";
import { AxiosRequestConfig } from "axios";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Integration tests", () => {
        const baseUrlToken = "https://login.microsoftonline.com";
        const clientId = "1064ad5e-e258-4793-b423-a786249030fc";
        const clientSecret = "*/eP=0s?v7QXRQR3sSNCJtPi2e=:Mj[l"; // Can be shared as only for integration tests and rate limited!!!
        const tenantId = "dc003016-66b7-4b23-a84d-9a44be793cf0";
        const logger = new NoLogger();
        const tokenProvider: ITokenProvider = new AzureActiveDirectoryAppRegistrationTokenProvider(baseUrlToken, clientId, clientSecret, tenantId, logger);
        const tokenCache = new DefaultTokenCache(tokenProvider, logger);
        const baseUrl = "https://resilience-typescript.azurewebsites.net/api/persons";
        // Local debugging of integration tests
        // const baseUrl = "https://localhost:44371/api/persons";
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        it("Should return a proper AAD token", async () => {
            // Arrange
            // Act
            const result = await tokenProvider.getToken();

            // Assert
            expect(result.accessToken).to.not.equal("");
            expect(result.expires).to.not.equal(0);
        });
        it("CRUD list", async () => {
            // Arrange
            const proxy = ResilientWebPipelineBuilder
                .New()
                .useCustomLogger(logger)
                .useTokenCache(tokenCache)
                .useCircuitBreaker(1, TimeSpansInMilliSeconds.TenMinutes, 10)
                .useRetry(2, 30)
                .useTimeout(3, TimeSpansInMilliSeconds.OneSecond)
                .useBaseUrl(baseUrl)
                .buildToCrud<Person>();

            // Act
            const list = await proxy.list();

            // Assert
            expect(list.status).to.equal(200);
            expect(list.data.length).to.be.greaterThan(0);
            const person1: Person = list.data[0];
            expect(person1.firstName.length).to.be.greaterThan(0);
            expect(person1.lastName.length).to.be.greaterThan(0);
        }).timeout(1000 * 60);
        it("CRUD add / delete / get / update", async () => {
            // Arrange
            const proxy = ResilientWebPipelineBuilder
                .New()
                .useCustomLogger(logger)
                .useTokenCache(tokenCache)
                .useCircuitBreaker(1, TimeSpansInMilliSeconds.TenMinutes, 10)
                .useRetry(2, 30)
                .useTimeout(3, TimeSpansInMilliSeconds.OneSecond)
                .useBaseUrl(baseUrl)
                .buildToCrud<Person>();

            // Act
            // Assert
            // Add
            let person: Person = { firstName: "Fabian", id: null, lastName: "Schwarz" };
            const result1 = await proxy.add(person);
            expect(result1.status).to.equal(201);
            expect(result1.data.id).to.be.greaterThan(0);
            // Get
            const result2 = await proxy.get(result1.data.id.toString());
            expect(result2.status).to.equal(200);
            expect(result1.data.firstName).to.equal(result2.data.firstName);
            expect(result1.data.id).to.equal(result2.data.id);
            expect(result1.data.lastName).to.equal(result2.data.lastName);
            person = result2.data;
            // Update
            person.firstName += " Resilience";
            person.lastName += " Typescript";
            const result3 = await proxy.update(person.id.toString(), person);
            expect(result3.status).to.equal(204);
            // Get
            const result4 = await proxy.get(result1.data.id.toString());
            expect(result4.data.firstName).to.equal(person.firstName);
            expect(result4.data.id).to.equal(person.id);
            expect(result4.data.lastName).to.equal(person.lastName);
            // Delete
            const result5 = await proxy.delete(person.id.toString());
            expect(result5.status).to.equal(204);
        }).timeout(1000 * 60);
        it("Axios Builder Test", async () => {
            // Arrange
            const proxy = ResilientWebPipelineBuilder
                .New()
                .useCustomLogger(logger)
                .useTokenCache(tokenCache)
                .useCircuitBreaker(1, TimeSpansInMilliSeconds.TenMinutes, 10)
                .useRetry(2, 30)
                .useTimeout(3, TimeSpansInMilliSeconds.OneSecond)
                .useBaseUrl(baseUrl)
                .builtToRequestFactory();

            // Act
            // Assert
            // List
            const list = await proxy
                .request()
                .get()
                .execute<Person[]>();
            expect(list.status).to.equal(200);
            expect(list.data.length).to.be.greaterThan(0);
            // Add
            let person: Person = { firstName: "Fabian", id: null, lastName: "Schwarz" };
            const add = await proxy
                .request()
                .post()
                .withBody(person)
                .execute<Person>();
            expect(add.status).to.equal(201);
            person = add.data;
            expect(person.id).to.be.greaterThan(0);
            expect(person.firstName.length).to.be.greaterThan(0);
            expect(person.lastName.length).to.be.greaterThan(0);
            // Get
            const get = await proxy
                .request()
                .get(`/${person.id}`)
                .execute<Person>();
            expect(get.status).to.equal(200);
            const person2: Person = get.data;
            expect(person2.firstName).to.equal(person.firstName);
            expect(person2.id).to.equal(person.id);
            expect(person2.lastName).to.equal(person.lastName);
            // Update
            person.firstName += " Resilience";
            person.lastName += " Typescript";
            const update = await proxy
                .request()
                .put(`/${person.id}`)
                .withBody(person)
                .execute();
            expect(update.status).to.equal(204);
            // Get
            const get2 = await proxy
                .request()
                .get(`/${person.id}`)
                .execute<Person>();
            expect(get2.status).to.equal(200);
            const person3: Person = get2.data;
            expect(person3.firstName).to.equal(person.firstName);
            expect(person3.id).to.equal(person.id);
            expect(person3.lastName).to.equal(person.lastName);
            // Delete
            const del = await proxy
                .request()
                .delete(`/${person.id}`)
                .execute();
            expect(del.status).to.equal(204);
        }).timeout(1000 * 60);
        it("Basic Proxy", async () => {
            // Arrange
            const proxy = ResilientWebPipelineBuilder
                .New()
                .useCustomLogger(logger)
                .useTokenCache(tokenCache)
                .useCircuitBreaker(1, TimeSpansInMilliSeconds.TenMinutes, 10)
                .useRetry(2, 30)
                .useTimeout(3, TimeSpansInMilliSeconds.OneSecond)
                .build();

            // Act
            const request = { } as AxiosRequestConfig;
            request.method = "GET";
            request.url = baseUrl;
            const list = await proxy.execute<Person[]>(request);

            // Assert
            expect(list.status).to.equal(200);
            expect(list.data.length).to.be.greaterThan(0);
            const person1: Person = list.data[0];
            expect(person1.firstName.length).to.be.greaterThan(0);
            expect(person1.lastName.length).to.be.greaterThan(0);
        });
    });
});
