function echoTest(message: string): string {
    return message;
}
function promiseTest(message: string): Promise<string> {
    return new Promise((resolve, reject) => {
        resolve(message);
    });
}
function errorTest() {
    throw new Error("This is throw an error");
}

export { echoTest, promiseTest, errorTest };
