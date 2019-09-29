
var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
            
            // TODO: mint multiple tokens
            await this.contract.mint(account_one,1,{from:account_one});
            await this.contract.mint(account_two,2,{from:account_one});
            await this.contract.mint(account_three,3,{from:account_one});
        })

        it('should return total supply', async function () { 
            const total = await this.contract.totalSupply.call();
            assert.equal(total.toNumber(),3,'Invalid token count');
        })

        it('should get token balance', async function () { 
            const balance = await this.contract.balanceOf.call(account_one);
            assert.equal(balance.toNumber(),1,'Invalid token balance');
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenUri = await this.contract.tokenURI.call(1);
            assert.equal(tokenUri,'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1','Invalid token URI')
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_two, account_three, 2, {from: account_two});  
            const owner = await this.contract.ownerOf.call(2);
            assert.equal(owner,account_three,'Invalid owner');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            var res = false;
            try {
                await this.contract.mint(account_four,5,{from:account_four});
            } catch (error) {
                res = true;
            }
            assert.equal(res,true);
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner.call();
            assert.equal(owner, account_one, "Invalid owner");
        })

    });
})