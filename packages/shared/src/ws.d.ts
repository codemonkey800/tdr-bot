export interface TestMessagePayload {
    message: string;
}
export interface ServerToClientEvents {
    testServer(payload: TestMessagePayload): void;
}
export interface ClientToServerEvents {
    testClient(payload: TestMessagePayload): void;
}
