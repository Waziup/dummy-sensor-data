import React from 'react';
import { create } from 'react-test-renderer';
import Codecs from '../../components/Codecs';

global.fetch = require('node-fetch');

afterEach(() => {
    jest.clearAllMocks();
});

describe('Codecs', () => {
    it('Renders correctly', () => {
        let tree = create(<Codecs />)
        expect(tree.toJSON()).toMatchSnapshot();
    })

})

/**

describe("GET /codecs ", () => {
    it("should respond with an array of codecs", async () => {
        const server = window.location.protocol + "//" + window.location.hostname;

        const authResp = await fetch(`${server}/auth/token`, {
            method: "POST",
            body: JSON.stringify({
                username: "admin",
                password: "loragateway"
            }),
        });
        expect(authResp.status).toBe(200);
        const token = await authResp.json();
        console.log(token);

        const resp = await fetch(`${server}/codecs`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        expect(resp.status).toBe(200);
    });
}); /** */