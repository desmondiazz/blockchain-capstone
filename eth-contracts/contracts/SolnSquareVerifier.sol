pragma solidity >=0.4.21 <0.6.0;

import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {
    SquareVerifier public verifier;

    constructor (address verifierAddress) ERC721Mintable() public {
        verifier = SquareVerifier(verifierAddress);
    }

    // TODO Create an event to emit when a solution is added
    event solutionAdded(uint256 tokenId,address to);

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions{
       uint tokenId;
        address to;
    }

    // TODO define an array of the above struct
    Solutions[] solutionsArr;

    // TODO define a mapping to store unique solutions submitted
    mapping (bytes32=>Solutions) uniqueSolutions;

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint tokenId,address to,bytes32 key) public {
        Solutions memory soln = Solutions({tokenId:tokenId,to:to});
        solutionsArr.push(soln);
        uniqueSolutions[key] = soln;
        emit solutionAdded(tokenId,to);
    }
    
    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    function mintNftToken(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input,
        address to,
        uint tokenId
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a,b,c,input));
        require(uniqueSolutions[key].to == address(0),'This solution has already been used before');
        require(verifier.verifyTx(a,b,c,input),'Invalid solution');
        addSolution(tokenId,to,key);
        super.mint(to,tokenId);
    }

    function getSolutions(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input)
        public view returns(uint){
            bytes32 key = keccak256(abi.encodePacked(a,b,c,input));
            return uniqueSolutions[key].tokenId;
    }
}



























