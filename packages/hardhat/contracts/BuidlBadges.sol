pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

/*
   ___       ___     ___      ___      ___      ___     _   _    _  _   
  / __|     | _ \   | __|    | __|    |   \    | _ \   | | | |  | \| |  
  \__ \     |  _/   | _|     | _|     | |) |   |   /   | |_| |  | .` |  
  |___/    _|_|_    |___|    |___|    |___/    |_|_\    \___/   |_|\_|  
_|"""""| _| """ | _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| 
"`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' 
   ___     _____    _  _      ___      ___      ___     _   _   __  __  
  | __|   |_   _|  | || |    | __|    | _ \    | __|   | | | | |  \/  | 
  | _|      | |    | __ |    | _|     |   /    | _|    | |_| | | |\/| | 
  |___|    _|_|_   |_||_|    |___|    |_|_\    |___|    \___/  |_|__|_| 
_|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| _|"""""| 
"`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' "`-0-0-' 
                _
              _( }
    -=   _  <<  \
        `.\__/`/\\
  -=      '--'\\  `
       -=     //
   -=|        \)

*/

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BuidlBadges is ERC1155, Ownable, AccessControl {
    bytes32 public constant ADMINS_ROLE = keccak256("ADMIN");

    uint256 public constant SIMPLE_NFT = 0;
    uint256 public constant STAKING = 1;
    uint256 public constant VENDOR = 2;
    uint256 public constant MULTI_SIG = 3;
    uint256 public constant ORACLES = 4;
    uint256 public constant EXCHANGE = 5;
    uint256 public constant BUYER_MINTS = 6;
    uint256 public constant STREAMS = 7;
    uint256 public constant DAMAGE_DEALER = 8;
    uint256 public constant COMMUNITY_HELPER = 9;

    /**
     * @dev Map user to array of badgeIds minted to them
     */
    mapping(address => uint256[]) public userBadges;

    event Minted(address recipient, uint256 tokenId);

    modifier adminOnly {
        require(hasRole(ADMINS_ROLE, msg.sender), "admin only function");
        _;
    }

    constructor(address[] memory admin)
    ERC1155(
        "https://forgottenbots.mypinata.cloud/ipfs/QmZesNT9tbpaNoy727fYRa7cB936dznKqFtZwNwUSbxJBg/{id}.json"
    )
    {
        transferOwnership(0x34aA3F359A9D614239015126635CE7732c18fDF3);

        for (uint256 i = 0; i < admin.length; ++i) {
            _setupRole(DEFAULT_ADMIN_ROLE, admin[i]);
            _setupRole(ADMINS_ROLE, admin[i]);
        }

        _setRoleAdmin(ADMINS_ROLE, DEFAULT_ADMIN_ROLE);

    }

    /**
     * @dev Contract URI
     */
    function uri() public pure returns (string memory) {
        return
        "https://forgottenbots.mypinata.cloud/ipfs/QmZesNT9tbpaNoy727fYRa7cB936dznKqFtZwNwUSbxJBg";
    }

    /**
     * @notice Mints the badge
     * @param tokenId identifies the badge to be minted
     */
    function mint(
        address recipient,
        uint256 tokenId
    ) public adminOnly {
        require((balanceOf(recipient, tokenId) == 0), "Already holds badge");
        _mint(recipient, tokenId, 1, "");

        //Set mapping, get an array of user badges l8r
        userBadges[recipient].push(tokenId);

        emit Minted(recipient, tokenId);
    }

    /**
     * @notice Gets [] of user badges 0-x
     */
    function getUserBadges(address user) public view returns (uint256[] memory) {
        return userBadges[user];
    }

    /**
     * @notice Block badge transfers
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
    internal
    virtual
    override(ERC1155)
    {
        require(from == address(0) || to == address(0), "NonTransferrableERC1155Token: non transferrable");
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /**
     * @notice Block badge approvals
     */
    function setApprovalForAll(
        address operator,
        bool _approved
    )
    public
    virtual
    override(ERC1155)
    {
        revert("NonApprovableERC1155Token: non-approvable");
    }

    /**
     * @notice Override interface bc multiple inheritance
     */
    function supportsInterface(
        bytes4 interfaceId
    )
    public
    view
    virtual
    override(ERC1155, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}