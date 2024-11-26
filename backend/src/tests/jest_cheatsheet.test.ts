//This is blackbox testing for echo function
import { echoTest, errorTest, promiseTest } from './jest_cheatsheet';

beforeAll(() => {
    //clear before each test block
});

describe('test echo function', () => {
    beforeEach(() => {
        //before each test
    });
    test('echo message', () => {
        expect(echoTest("message")).toBe("message");
    });
    test('echo not to be', () => {
        expect(echoTest("1")).not.toBe(2);
    });
});

describe('test promise function', () => {
    test('promise awit/async', async () => {
        await expect(Promise.resolve(promiseTest("message"))).resolves.toBe("message");
    });
});

describe('test error function', () => {
    test('throwError should throw an error', () => {
        expect(() => {
            errorTest();
        }).toThrow(Error);
        // Optionally, you can also check for the specific error message
        expect(() => {
            errorTest();
        }).toThrow("This is throw an error");
    });
});

afterAll(() => {
    //clear after each test block
    //not really needed in most of cases
});
