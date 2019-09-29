const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const validProof = require('../../zokrates/code/square/proof');


contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    
    describe('Test Soln Square Verifier', function () {
        beforeEach(async function () { 
            const squareVerifier = await SquareVerifier.new({from:account_one});
            this.contract = await SolnSquareVerifier.new(squareVerifier.address,{from: account_one});        
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Should be able to add a new solution', async function () {
            await this.contract.mintNftToken(validProof.proof.a,validProof.proof.b,validProof.proof.c,validProof.inputs,account_one,1);
            var token = await this.contract.getSolutions(validProof.proof.a,validProof.proof.b,validProof.proof.c,validProof.inputs);
            assert.equal(token.toNumber(),1,'Solution is not added');
        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Should be able to mint a new token',async function(){
            var result = true;
            try {
                await this.contract.mintNftToken(validProof.proof.a,validProof.proof.b,validProof.proof.c,validProof.inputs,account_one,12);
            } catch (error) {
                result = false;
            }
            assert.equal(result,true);
        });
    });
    
})