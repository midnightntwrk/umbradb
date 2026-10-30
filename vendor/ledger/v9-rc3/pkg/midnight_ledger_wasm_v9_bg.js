export class AuthorizedClaim {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AuthorizedClaim.prototype);
        obj.__wbg_ptr = ptr;
        AuthorizedClaimFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AuthorizedClaimFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_authorizedclaim_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    get coin() {
        const ret = wasm.authorizedclaim_coin(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} proof_marker
     * @param {Uint8Array} raw
     * @returns {AuthorizedClaim}
     */
    static deserialize(proof_marker, raw) {
        const ptr0 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.authorizedclaim_deserialize(ptr0, len0, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AuthorizedClaim.__wrap(ret[0]);
    }
    /**
     * @returns {AuthorizedClaim}
     */
    eraseProof() {
        const ret = wasm.authorizedclaim_eraseProof(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return AuthorizedClaim.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.authorizedclaim_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        AuthorizedClaimFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get recipient() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.authorizedclaim_recipient(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.authorizedclaim_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.authorizedclaim_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) AuthorizedClaim.prototype[Symbol.dispose] = AuthorizedClaim.prototype.free;

export class Binding {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Binding.prototype);
        obj.__wbg_ptr = ptr;
        BindingFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BindingFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_binding_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {Binding}
     */
    static deserialize(raw) {
        const ret = wasm.binding_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Binding.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get instance() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.binding_instance(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} binding
     */
    constructor(binding) {
        const ptr0 = passStringToWasm0(binding, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.binding_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        BindingFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.binding_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.binding_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Binding.prototype[Symbol.dispose] = Binding.prototype.free;

export class ChargedState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ChargedState.prototype);
        obj.__wbg_ptr = ptr;
        ChargedStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChargedStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chargedstate_free(ptr, 0);
    }
    /**
     * @param {StateValue} state
     */
    constructor(state) {
        _assertClass(state, StateValue);
        const ret = wasm.chargedstate_new(state.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        ChargedStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {StateValue}
     */
    get state() {
        const ret = wasm.chargedstate_state(this.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.chargedstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ChargedState.prototype[Symbol.dispose] = ChargedState.prototype.free;

export class ClaimRewardsTransaction {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ClaimRewardsTransaction.prototype);
        obj.__wbg_ptr = ptr;
        ClaimRewardsTransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ClaimRewardsTransactionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_claimrewardstransaction_free(ptr, 0);
    }
    /**
     * @param {any} signature
     * @returns {ClaimRewardsTransaction}
     */
    addSignature(signature) {
        const ret = wasm.claimrewardstransaction_addSignature(this.__wbg_ptr, signature);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ClaimRewardsTransaction.__wrap(ret[0]);
    }
    /**
     * @param {string} signature_marker
     * @param {string} network_id
     * @param {bigint} value
     * @param {any} owner
     * @param {string} nonce
     * @param {any} signature
     * @param {any} kind
     */
    constructor(signature_marker, network_id, value, owner, nonce, signature, kind) {
        const ptr0 = passStringToWasm0(signature_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(network_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(nonce, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.claimrewardstransaction_construct(ptr0, len0, ptr1, len1, value, owner, ptr2, len2, signature, kind);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ClaimRewardsTransactionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    get dataToSign() {
        const ret = wasm.claimrewardstransaction_dataToSign(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} signature_marker
     * @param {Uint8Array} raw
     * @returns {ClaimRewardsTransaction}
     */
    static deserialize(signature_marker, raw) {
        const ptr0 = passStringToWasm0(signature_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.claimrewardstransaction_deserialize(ptr0, len0, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ClaimRewardsTransaction.__wrap(ret[0]);
    }
    /**
     * @returns {ClaimRewardsTransaction}
     */
    eraseSignatures() {
        const ret = wasm.claimrewardstransaction_eraseSignatures(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ClaimRewardsTransaction.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get kind() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.claimrewardstransaction_kind(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} network_id
     * @param {bigint} value
     * @param {any} owner
     * @param {string} nonce
     * @param {string} kind
     * @returns {ClaimRewardsTransaction}
     */
    static new(network_id, value, owner, nonce, kind) {
        const ptr0 = passStringToWasm0(network_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(nonce, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(kind, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.claimrewardstransaction_new(ptr0, len0, value, owner, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ClaimRewardsTransaction.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get nonce() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.claimrewardstransaction_nonce(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get owner() {
        const ret = wasm.claimrewardstransaction_owner(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.claimrewardstransaction_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get signature() {
        const ret = wasm.claimrewardstransaction_signature(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.claimrewardstransaction_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get value() {
        const ret = wasm.claimrewardstransaction_value(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) ClaimRewardsTransaction.prototype[Symbol.dispose] = ClaimRewardsTransaction.prototype.free;

export class CoinSecretKey {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CoinSecretKey.prototype);
        obj.__wbg_ptr = ptr;
        CoinSecretKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CoinSecretKeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_coinsecretkey_free(ptr, 0);
    }
    clear() {
        wasm.coinsecretkey_clear(this.__wbg_ptr);
    }
    constructor() {
        const ret = wasm.coinsecretkey_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        CoinSecretKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    public_key() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.coinsecretkey_public_key(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    yesIKnowTheSecurityImplicationsOfThis_serialize() {
        const ret = wasm.coinsecretkey_yesIKnowTheSecurityImplicationsOfThis_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) CoinSecretKey.prototype[Symbol.dispose] = CoinSecretKey.prototype.free;

export class ContractCall {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractCall.prototype);
        obj.__wbg_ptr = ptr;
        ContractCallFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractCallFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractcall_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get address() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.contractcall_address(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get communicationCommitment() {
        const ret = wasm.contractcall_communicationCommitment(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get entryPoint() {
        const ret = wasm.contractcall_entryPoint(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get fallibleTranscript() {
        const ret = wasm.contractcall_fallibleTranscript(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get guaranteedTranscript() {
        const ret = wasm.contractcall_guaranteedTranscript(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    constructor() {
        const ret = wasm.contractcall_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractCallFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get proof() {
        const ret = wasm.contractcall_proof(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractcall_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractCall.prototype[Symbol.dispose] = ContractCall.prototype.free;

export class ContractCallPrototype {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractCallPrototypeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractcallprototype_free(ptr, 0);
    }
    /**
     * @param {any} _parent_binding
     * @returns {ContractCall}
     */
    intoCall(_parent_binding) {
        const ret = wasm.contractcallprototype_intoCall(this.__wbg_ptr, _parent_binding);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractCall.__wrap(ret[0]);
    }
    /**
     * @param {string} address
     * @param {any} entry_point
     * @param {ContractOperation} op
     * @param {any} guaranteed_public_transcript
     * @param {any} fallible_public_transcript
     * @param {any[]} private_transcript_outputs
     * @param {any} input
     * @param {any} output
     * @param {string} communication_commitment_rand
     * @param {string} key_location
     */
    constructor(address, entry_point, op, guaranteed_public_transcript, fallible_public_transcript, private_transcript_outputs, input, output, communication_commitment_rand, key_location) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(op, ContractOperation);
        const ptr1 = passArrayJsValueToWasm0(private_transcript_outputs, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(communication_commitment_rand, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(key_location, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.contractcallprototype_new(ptr0, len0, entry_point, op.__wbg_ptr, guaranteed_public_transcript, fallible_public_transcript, ptr1, len1, input, output, ptr2, len2, ptr3, len3);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractCallPrototypeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractcallprototype_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractCallPrototype.prototype[Symbol.dispose] = ContractCallPrototype.prototype.free;

export class ContractDeploy {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractDeploy.prototype);
        obj.__wbg_ptr = ptr;
        ContractDeployFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractDeployFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractdeploy_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get address() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.contractdeploy_address(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {ContractState}
     */
    get initialState() {
        const ret = wasm.contractdeploy_initialState(this.__wbg_ptr);
        return ContractState.__wrap(ret);
    }
    /**
     * @param {ContractState} initial_state
     */
    constructor(initial_state) {
        _assertClass(initial_state, ContractState);
        const ret = wasm.contractdeploy_new(initial_state.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        ContractDeployFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractdeploy_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractDeploy.prototype[Symbol.dispose] = ContractDeploy.prototype.free;

export class ContractMaintenanceAuthority {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractMaintenanceAuthority.prototype);
        obj.__wbg_ptr = ptr;
        ContractMaintenanceAuthorityFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractMaintenanceAuthorityFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractmaintenanceauthority_free(ptr, 0);
    }
    /**
     * @returns {Array<any>}
     */
    get committee() {
        const ret = wasm.contractmaintenanceauthority_committee(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get counter() {
        const ret = wasm.contractmaintenanceauthority_counter(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ContractMaintenanceAuthority}
     */
    static deserialize(raw) {
        const ret = wasm.contractmaintenanceauthority_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractMaintenanceAuthority.__wrap(ret[0]);
    }
    /**
     * @param {Array<any>} committee
     * @param {number} threshold
     * @param {bigint | null} [counter]
     */
    constructor(committee, threshold, counter) {
        const ret = wasm.contractmaintenanceauthority_new(committee, threshold, isLikeNone(counter) ? 0 : addToExternrefTable0(counter));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractMaintenanceAuthorityFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    serialize() {
        const ret = wasm.contractmaintenanceauthority_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {number}
     */
    get threshold() {
        const ret = wasm.contractmaintenanceauthority_threshold(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractmaintenanceauthority_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractMaintenanceAuthority.prototype[Symbol.dispose] = ContractMaintenanceAuthority.prototype.free;

export class ContractOperation {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractOperation.prototype);
        obj.__wbg_ptr = ptr;
        ContractOperationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractOperationFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractoperation_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ContractOperation}
     */
    static deserialize(raw) {
        const ret = wasm.contractoperation_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractOperation.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.contractoperation_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractOperationFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    serialize() {
        const ret = wasm.contractoperation_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} key
     */
    set verifierKey(key) {
        const ret = wasm.contractoperation_set_verifier_key(this.__wbg_ptr, key);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractoperation_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get verifierKey() {
        const ret = wasm.contractoperation_verifier_key(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) ContractOperation.prototype[Symbol.dispose] = ContractOperation.prototype.free;

export class ContractOperationVersion {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractOperationVersion.prototype);
        obj.__wbg_ptr = ptr;
        ContractOperationVersionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractOperationVersionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractoperationversion_free(ptr, 0);
    }
    /**
     * @param {string} version
     */
    constructor(version) {
        const ptr0 = passStringToWasm0(version, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.contractoperationversion_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractOperationVersionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractoperationversion_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractoperationversion_version(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractOperationVersion.prototype[Symbol.dispose] = ContractOperationVersion.prototype.free;

export class ContractOperationVersionedVerifierKey {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractOperationVersionedVerifierKey.prototype);
        obj.__wbg_ptr = ptr;
        ContractOperationVersionedVerifierKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractOperationVersionedVerifierKeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractoperationversionedverifierkey_free(ptr, 0);
    }
    /**
     * @param {string} version
     * @param {Uint8Array} raw_vk
     */
    constructor(version, raw_vk) {
        const ptr0 = passStringToWasm0(version, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.contractoperationversionedverifierkey_new(ptr0, len0, raw_vk);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractOperationVersionedVerifierKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    get rawVk() {
        const ret = wasm.contractoperationversionedverifierkey_raw_vk(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractoperationversionedverifierkey_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractoperationversionedverifierkey_version(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractOperationVersionedVerifierKey.prototype[Symbol.dispose] = ContractOperationVersionedVerifierKey.prototype.free;

export class ContractState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractState.prototype);
        obj.__wbg_ptr = ptr;
        ContractStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractstate_free(ptr, 0);
    }
    /**
     * @returns {Map<any, any>}
     */
    get balance() {
        const ret = wasm.contractstate_balance(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {ChargedState}
     */
    get data() {
        const ret = wasm.contractstate_data(this.__wbg_ptr);
        return ChargedState.__wrap(ret);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ContractState}
     */
    static deserialize(raw) {
        const ret = wasm.contractstate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractState.__wrap(ret[0]);
    }
    /**
     * @returns {ContractMaintenanceAuthority}
     */
    get maintenanceAuthority() {
        const ret = wasm.contractstate_maintenance_authority(this.__wbg_ptr);
        return ContractMaintenanceAuthority.__wrap(ret);
    }
    constructor() {
        const ret = wasm.contractstate_new();
        this.__wbg_ptr = ret >>> 0;
        ContractStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} operation
     * @returns {ContractOperation | undefined}
     */
    operation(operation) {
        const ret = wasm.contractstate_operation(this.__wbg_ptr, operation);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : ContractOperation.__wrap(ret[0]);
    }
    /**
     * @returns {any[]}
     */
    operations() {
        const ret = wasm.contractstate_operations(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {any} query
     * @param {CostModel} cost_model
     * @returns {any}
     */
    query(query, cost_model) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.contractstate_query(this.__wbg_ptr, query, cost_model.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    serialize() {
        const ret = wasm.contractstate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} operation
     * @param {ContractOperation} value
     */
    setOperation(operation, value) {
        _assertClass(value, ContractOperation);
        const ret = wasm.contractstate_setOperation(this.__wbg_ptr, operation, value.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Map<any, any>} value_map
     */
    set balance(value_map) {
        const ret = wasm.contractstate_set_balance(this.__wbg_ptr, value_map);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {ChargedState} data
     */
    set data(data) {
        _assertClass(data, ChargedState);
        wasm.contractstate_set_data(this.__wbg_ptr, data.__wbg_ptr);
    }
    /**
     * @param {ContractMaintenanceAuthority} authority
     */
    set maintenanceAuthority(authority) {
        _assertClass(authority, ContractMaintenanceAuthority);
        wasm.contractstate_set_maintenance_authority(this.__wbg_ptr, authority.__wbg_ptr);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContractState.prototype[Symbol.dispose] = ContractState.prototype.free;

export class CostModel {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CostModel.prototype);
        obj.__wbg_ptr = ptr;
        CostModelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CostModelFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_costmodel_free(ptr, 0);
    }
    /**
     * @returns {CostModel}
     */
    static initialCostModel() {
        const ret = wasm.costmodel_initialCostModel();
        return CostModel.__wrap(ret);
    }
    constructor() {
        const ret = wasm.costmodel_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        CostModelFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.costmodel_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) CostModel.prototype[Symbol.dispose] = CostModel.prototype.free;

export class DustActions {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustActions.prototype);
        obj.__wbg_ptr = ptr;
        DustActionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustActionsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustactions_free(ptr, 0);
    }
    /**
     * @returns {Date}
     */
    get ctime() {
        const ret = wasm.dustactions_ctime(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} signature_marker
     * @param {string} proof_marker
     * @param {Uint8Array} raw
     * @returns {DustActions}
     */
    static deserialize(signature_marker, proof_marker, raw) {
        const ptr0 = passStringToWasm0(signature_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.dustactions_deserialize(ptr0, len0, ptr1, len1, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustActions.__wrap(ret[0]);
    }
    /**
     * @param {string} signature_marker
     * @param {string} proof_marker
     * @param {Date} ctime
     * @param {any} spends
     * @param {any} registrations
     */
    constructor(signature_marker, proof_marker, ctime, spends, registrations) {
        const ptr0 = passStringToWasm0(signature_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.dustactions_new(ptr0, len0, ptr1, len1, ctime, spends, registrations);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustActionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {DustRegistration[]}
     */
    get registrations() {
        const ret = wasm.dustactions_registrations(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.dustactions_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Date} ctime
     */
    set ctime(ctime) {
        const ret = wasm.dustactions_set_ctime(this.__wbg_ptr, ctime);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} registrations
     */
    set registrations(registrations) {
        const ret = wasm.dustactions_set_registrations(this.__wbg_ptr, registrations);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} spends
     */
    set spends(spends) {
        const ret = wasm.dustactions_set_spends(this.__wbg_ptr, spends);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {DustSpend[]}
     */
    get spends() {
        const ret = wasm.dustactions_spends(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dustactions_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) DustActions.prototype[Symbol.dispose] = DustActions.prototype.free;

export class DustGenerationState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustGenerationState.prototype);
        obj.__wbg_ptr = ptr;
        DustGenerationStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustGenerationStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustgenerationstate_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {DustGenerationState}
     */
    static deserialize(raw) {
        const ret = wasm.dustgenerationstate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustGenerationState.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.dustgenerationstate_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustGenerationStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.dustgenerationstate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dustgenerationstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) DustGenerationState.prototype[Symbol.dispose] = DustGenerationState.prototype.free;

export class DustGenerationTreeInsertionPath {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustGenerationTreeInsertionPath.prototype);
        obj.__wbg_ptr = ptr;
        DustGenerationTreeInsertionPathFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustGenerationTreeInsertionPathFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustgenerationtreeinsertionpath_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {DustGenerationTreeInsertionPath}
     */
    static deserialize(raw) {
        const ret = wasm.dustgenerationtreeinsertionpath_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustGenerationTreeInsertionPath.__wrap(ret[0]);
    }
    /**
     * @param {DustGenerationState} state
     * @param {bigint} index
     */
    constructor(state, index) {
        _assertClass(state, DustGenerationState);
        const ret = wasm.dustgenerationtreeinsertionpath_new(state.__wbg_ptr, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustGenerationTreeInsertionPathFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.dustgenerationtreeinsertionpath_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dustgenerationtreeinsertionpath_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) DustGenerationTreeInsertionPath.prototype[Symbol.dispose] = DustGenerationTreeInsertionPath.prototype.free;

export class DustLocalState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustLocalState.prototype);
        obj.__wbg_ptr = ptr;
        DustLocalStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustLocalStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustlocalstate_free(ptr, 0);
    }
    /**
     * @param {bigint} nullifier
     * @param {any} utxo
     * @param {Date | null} [pending_until]
     * @returns {DustLocalState}
     */
    addUtxo(nullifier, utxo, pending_until) {
        const ret = wasm.dustlocalstate_addUtxo(this.__wbg_ptr, nullifier, utxo, isLikeNone(pending_until) ? 0 : addToExternrefTable0(pending_until));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {DustStateMerkleTreeCollapsedUpdate} update
     * @returns {DustLocalState}
     */
    applyCommitmentCollapsedUpdate(update) {
        _assertClass(update, DustStateMerkleTreeCollapsedUpdate);
        const ret = wasm.dustlocalstate_applyCommitmentCollapsedUpdate(this.__wbg_ptr, update.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {DustStateMerkleTreeCollapsedUpdate} update
     * @returns {DustLocalState}
     */
    applyGenerationCollapsedUpdate(update) {
        _assertClass(update, DustStateMerkleTreeCollapsedUpdate);
        const ret = wasm.dustlocalstate_applyGenerationCollapsedUpdate(this.__wbg_ptr, update.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} commitment_index_start
     * @param {bigint} commitment_index_end
     * @returns {DustLocalState}
     */
    collapseCommitmentTree(commitment_index_start, commitment_index_end) {
        const ret = wasm.dustlocalstate_collapseCommitmentTree(this.__wbg_ptr, commitment_index_start, commitment_index_end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} generation_index_start
     * @param {bigint} generation_index_end
     * @returns {DustLocalState}
     */
    collapseGenerationTree(generation_index_start, generation_index_end) {
        const ret = wasm.dustlocalstate_collapseGenerationTree(this.__wbg_ptr, generation_index_start, generation_index_end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get commitmentTreeFirstFree() {
        const ret = wasm.dustlocalstate_commitmentTreeFirstFree(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {any}
     */
    commitmentTreeRoot() {
        const ret = wasm.dustlocalstate_commitmentTreeRoot(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {DustLocalState}
     */
    static deserialize(raw) {
        const ret = wasm.dustlocalstate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} nullifier
     * @returns {any}
     */
    findUtxoByNullifier(nullifier) {
        const ret = wasm.dustlocalstate_findUtxoByNullifier(this.__wbg_ptr, nullifier);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get generatingTreeFirstFree() {
        const ret = wasm.dustlocalstate_generatingTreeFirstFree(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {any}
     */
    generatingTreeRoot() {
        const ret = wasm.dustlocalstate_generatingTreeRoot(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} qdo
     * @returns {any}
     */
    generationInfo(qdo) {
        const ret = wasm.dustlocalstate_generationInfo(this.__wbg_ptr, qdo);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {bigint} commitment_index
     * @param {any} qdo
     * @param {boolean} own_qdo
     * @returns {DustLocalState}
     */
    insertCommitment(commitment_index, qdo, own_qdo) {
        const ret = wasm.dustlocalstate_insertCommitment(this.__wbg_ptr, commitment_index, qdo, own_qdo);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} generation_index
     * @param {any} generation
     * @param {string | null} [initial_nonce]
     * @returns {DustLocalState}
     */
    insertGenerationInfo(generation_index, generation, initial_nonce) {
        var ptr0 = isLikeNone(initial_nonce) ? 0 : passStringToWasm0(initial_nonce, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.dustlocalstate_insertGenerationInfo(this.__wbg_ptr, generation_index, generation, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {DustParameters} params
     */
    constructor(params) {
        _assertClass(params, DustParameters);
        const ret = wasm.dustlocalstate_new(params.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        DustLocalStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Map<any, any>}
     */
    get nullifiers() {
        const ret = wasm.dustlocalstate_nullifiers(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {DustParameters}
     */
    get params() {
        const ret = wasm.dustlocalstate_params(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustParameters.__wrap(ret[0]);
    }
    /**
     * @param {Date} time
     * @returns {DustLocalState}
     */
    processTtls(time) {
        const ret = wasm.dustlocalstate_processTtls(this.__wbg_ptr, time);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} commitment_index
     * @returns {DustLocalState}
     */
    removeCommitment(commitment_index) {
        const ret = wasm.dustlocalstate_removeCommitment(this.__wbg_ptr, commitment_index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} generation_index
     * @param {any} generation
     * @returns {DustLocalState}
     */
    removeGenerationInfo(generation_index, generation) {
        const ret = wasm.dustlocalstate_removeGenerationInfo(this.__wbg_ptr, generation_index, generation);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} nullifier
     * @returns {DustLocalState}
     */
    removeUtxo(nullifier) {
        const ret = wasm.dustlocalstate_removeUtxo(this.__wbg_ptr, nullifier);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {DustSecretKey} sk
     * @param {Event[]} events
     * @returns {DustLocalState}
     */
    replayEvents(sk, events) {
        _assertClass(sk, DustSecretKey);
        const ptr0 = passArrayJsValueToWasm0(events, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dustlocalstate_replayEvents(this.__wbg_ptr, sk.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @param {DustSecretKey} sk
     * @param {Event[]} events
     * @returns {DustLocalStateWithChanges}
     */
    replayEventsWithChanges(sk, events) {
        _assertClass(sk, DustSecretKey);
        const ptr0 = passArrayJsValueToWasm0(events, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dustlocalstate_replayEventsWithChanges(this.__wbg_ptr, sk.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalStateWithChanges.__wrap(ret[0]);
    }
    /**
     * @param {DustSecretKey} sk
     * @param {Uint8Array} raw_events
     * @returns {DustLocalStateWithChanges}
     */
    replayRawEvents(sk, raw_events) {
        _assertClass(sk, DustSecretKey);
        const ptr0 = passArray8ToWasm0(raw_events, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dustlocalstate_replayRawEvents(this.__wbg_ptr, sk.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalStateWithChanges.__wrap(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.dustlocalstate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Date} sync_time
     */
    set syncTime(sync_time) {
        const ret = wasm.dustlocalstate_set_syncTime(this.__wbg_ptr, sync_time);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {DustSecretKey} sk
     * @param {any} utxo
     * @param {bigint} v_fee
     * @param {Date} ctime
     * @returns {Array<any>}
     */
    spend(sk, utxo, v_fee, ctime) {
        _assertClass(sk, DustSecretKey);
        const ret = wasm.dustlocalstate_spend(this.__wbg_ptr, sk.__wbg_ptr, utxo, v_fee, ctime);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Date}
     */
    get syncTime() {
        const ret = wasm.dustlocalstate_syncTime(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dustlocalstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {DustGenerationTreeInsertionPath} insertion
     * @returns {DustLocalState}
     */
    updateGenerationTreeFromEvidence(insertion) {
        _assertClass(insertion, DustGenerationTreeInsertionPath);
        const ret = wasm.dustlocalstate_updateGenerationTreeFromEvidence(this.__wbg_ptr, insertion.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustLocalState.__wrap(ret[0]);
    }
    /**
     * @returns {any[]}
     */
    get utxos() {
        const ret = wasm.dustlocalstate_utxos(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {Date} time
     * @returns {bigint}
     */
    walletBalance(time) {
        const ret = wasm.dustlocalstate_walletBalance(this.__wbg_ptr, time);
        return ret;
    }
}
if (Symbol.dispose) DustLocalState.prototype[Symbol.dispose] = DustLocalState.prototype.free;

export class DustLocalStateWithChanges {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustLocalStateWithChanges.prototype);
        obj.__wbg_ptr = ptr;
        DustLocalStateWithChangesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustLocalStateWithChangesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustlocalstatewithchanges_free(ptr, 0);
    }
    /**
     * @returns {DustStateChanges[]}
     */
    get changes() {
        const ret = wasm.dustlocalstatewithchanges_changes(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {DustLocalState}
     */
    get state() {
        const ret = wasm.dustlocalstatewithchanges_state(this.__wbg_ptr);
        return DustLocalState.__wrap(ret);
    }
}
if (Symbol.dispose) DustLocalStateWithChanges.prototype[Symbol.dispose] = DustLocalStateWithChanges.prototype.free;

export class DustParameters {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustParameters.prototype);
        obj.__wbg_ptr = ptr;
        DustParametersFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustParametersFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustparameters_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {DustParameters}
     */
    static deserialize(raw) {
        const ret = wasm.dustparameters_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustParameters.__wrap(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get dustGracePeriodSeconds() {
        const ret = wasm.dustparameters_dustGracePeriodSeconds(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {bigint}
     */
    get generationDecayRate() {
        const ret = wasm.dustparameters_generationDecayRate(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {bigint} night_dust_ratio
     * @param {bigint} generation_decay_rate
     * @param {bigint} dust_grace_period_seconds
     */
    constructor(night_dust_ratio, generation_decay_rate, dust_grace_period_seconds) {
        const ret = wasm.dustparameters_new(night_dust_ratio, generation_decay_rate, dust_grace_period_seconds);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustParametersFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {bigint}
     */
    get nightDustRatio() {
        const ret = wasm.dustparameters_nightDustRatio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.dustparameters_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {bigint} dust_grace_period_seconds
     */
    set dustGracePeriodSeconds(dust_grace_period_seconds) {
        const ret = wasm.dustparameters_set_dustGracePeriodSeconds(this.__wbg_ptr, dust_grace_period_seconds);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {bigint} generation_decay_rate
     */
    set generationDecayRate(generation_decay_rate) {
        const ret = wasm.dustparameters_set_generationDecayRate(this.__wbg_ptr, generation_decay_rate);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {bigint} night_dust_ratio
     */
    set nightDustRatio(night_dust_ratio) {
        const ret = wasm.dustparameters_set_nightDustRatio(this.__wbg_ptr, night_dust_ratio);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {bigint}
     */
    get timeToCapSeconds() {
        const ret = wasm.dustparameters_timeToCapSeconds(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dustparameters_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) DustParameters.prototype[Symbol.dispose] = DustParameters.prototype.free;

export class DustRegistration {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustRegistration.prototype);
        obj.__wbg_ptr = ptr;
        DustRegistrationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustRegistrationFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustregistration_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get allowFeePayment() {
        const ret = wasm.dustregistration_allowFeePayment(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} signature_marker
     * @param {Uint8Array} raw
     * @returns {DustRegistration}
     */
    static deserialize(signature_marker, raw) {
        const ptr0 = passStringToWasm0(signature_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dustregistration_deserialize(ptr0, len0, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustRegistration.__wrap(ret[0]);
    }
    /**
     * @returns {bigint | undefined}
     */
    get dustAddress() {
        const ret = wasm.dustregistration_dustAddress(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} signature_marker
     * @param {any} night_key
     * @param {bigint | null | undefined} dust_address
     * @param {bigint} allow_fee_payment
     * @param {any} signature
     */
    constructor(signature_marker, night_key, dust_address, allow_fee_payment, signature) {
        const ptr0 = passStringToWasm0(signature_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dustregistration_new(ptr0, len0, night_key, isLikeNone(dust_address) ? 0 : addToExternrefTable0(dust_address), allow_fee_payment, signature);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustRegistrationFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get nightKey() {
        const ret = wasm.dustregistration_nightKey(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.dustregistration_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {bigint} allow_fee_payment
     */
    set allowFeePayment(allow_fee_payment) {
        const ret = wasm.dustregistration_set_allowFeePayment(this.__wbg_ptr, allow_fee_payment);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {bigint | null} [dust_address]
     */
    set dustAddress(dust_address) {
        const ret = wasm.dustregistration_set_dustAddress(this.__wbg_ptr, isLikeNone(dust_address) ? 0 : addToExternrefTable0(dust_address));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} night_key
     */
    set nightKey(night_key) {
        const ret = wasm.dustregistration_set_nightKey(this.__wbg_ptr, night_key);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} signature
     */
    set signature(signature) {
        const ret = wasm.dustregistration_set_signature(this.__wbg_ptr, signature);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {any}
     */
    get signature() {
        const ret = wasm.dustregistration_signature(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dustregistration_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) DustRegistration.prototype[Symbol.dispose] = DustRegistration.prototype.free;

export class DustSecretKey {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustSecretKey.prototype);
        obj.__wbg_ptr = ptr;
        DustSecretKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustSecretKeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustsecretkey_free(ptr, 0);
    }
    clear() {
        wasm.dustsecretkey_clear(this.__wbg_ptr);
    }
    /**
     * @param {bigint} bigint
     * @returns {DustSecretKey}
     */
    static fromBigint(bigint) {
        const ret = wasm.dustsecretkey_fromBigint(bigint);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustSecretKey.__wrap(ret[0]);
    }
    /**
     * @param {Uint8Array} seed
     * @returns {DustSecretKey}
     */
    static fromSeed(seed) {
        const ret = wasm.dustsecretkey_fromSeed(seed);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustSecretKey.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.dustsecretkey_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustSecretKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {bigint}
     */
    get publicKey() {
        const ret = wasm.dustsecretkey_publicKey(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) DustSecretKey.prototype[Symbol.dispose] = DustSecretKey.prototype.free;

export class DustSpend {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustSpend.prototype);
        obj.__wbg_ptr = ptr;
        DustSpendFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustSpendFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustspend_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.dustspend_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustSpendFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {bigint}
     */
    get newCommitment() {
        const ret = wasm.dustspend_newCommitment(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {bigint}
     */
    get oldNullifier() {
        const ret = wasm.dustspend_oldNullifier(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    get proof() {
        const ret = wasm.dustspend_proof(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dustspend_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get vFee() {
        const ret = wasm.dustspend_vFee(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) DustSpend.prototype[Symbol.dispose] = DustSpend.prototype.free;

export class DustState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustState.prototype);
        obj.__wbg_ptr = ptr;
        DustStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_duststate_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {DustState}
     */
    static deserialize(raw) {
        const ret = wasm.duststate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustState.__wrap(ret[0]);
    }
    /**
     * @returns {DustGenerationState}
     */
    get generation() {
        const ret = wasm.duststate_generation(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustGenerationState.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.duststate_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.duststate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.duststate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {DustUtxoState}
     */
    get utxo() {
        const ret = wasm.duststate_utxo(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustUtxoState.__wrap(ret[0]);
    }
}
if (Symbol.dispose) DustState.prototype[Symbol.dispose] = DustState.prototype.free;

export class DustStateChanges {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustStateChanges.prototype);
        obj.__wbg_ptr = ptr;
        DustStateChangesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustStateChangesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_duststatechanges_free(ptr, 0);
    }
    /**
     * @param {string} source
     * @param {any[]} received_utxos
     * @param {any[]} spent_utxos
     */
    constructor(source, received_utxos, spent_utxos) {
        const ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(received_utxos, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayJsValueToWasm0(spent_utxos, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.duststatechanges_new(ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustStateChangesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Array<any>}
     */
    get receivedUtxos() {
        const ret = wasm.duststatechanges_receivedUtxos(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {string}
     */
    get source() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.duststatechanges_source(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {Array<any>}
     */
    get spentUtxos() {
        const ret = wasm.duststatechanges_spentUtxos(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.duststatechanges_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) DustStateChanges.prototype[Symbol.dispose] = DustStateChanges.prototype.free;

export class DustStateMerkleTreeCollapsedUpdate {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustStateMerkleTreeCollapsedUpdate.prototype);
        obj.__wbg_ptr = ptr;
        DustStateMerkleTreeCollapsedUpdateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustStateMerkleTreeCollapsedUpdateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_duststatemerkletreecollapsedupdate_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {DustStateMerkleTreeCollapsedUpdate}
     */
    static deserialize(raw) {
        const ret = wasm.duststatemerkletreecollapsedupdate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustStateMerkleTreeCollapsedUpdate.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.duststatemerkletreecollapsedupdate_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustStateMerkleTreeCollapsedUpdateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {DustUtxoState} state
     * @param {bigint} start
     * @param {bigint} end
     * @returns {DustStateMerkleTreeCollapsedUpdate}
     */
    static newFromCommitmentTree(state, start, end) {
        _assertClass(state, DustUtxoState);
        const ret = wasm.duststatemerkletreecollapsedupdate_newFromCommitmentTree(state.__wbg_ptr, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustStateMerkleTreeCollapsedUpdate.__wrap(ret[0]);
    }
    /**
     * @param {DustGenerationState} state
     * @param {bigint} start
     * @param {bigint} end
     * @returns {DustStateMerkleTreeCollapsedUpdate}
     */
    static newFromGenerationTree(state, start, end) {
        _assertClass(state, DustGenerationState);
        const ret = wasm.duststatemerkletreecollapsedupdate_newFromGenerationTree(state.__wbg_ptr, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustStateMerkleTreeCollapsedUpdate.__wrap(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.duststatemerkletreecollapsedupdate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.duststatemerkletreecollapsedupdate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) DustStateMerkleTreeCollapsedUpdate.prototype[Symbol.dispose] = DustStateMerkleTreeCollapsedUpdate.prototype.free;

export class DustUtxoState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DustUtxoState.prototype);
        obj.__wbg_ptr = ptr;
        DustUtxoStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DustUtxoStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dustutxostate_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {DustUtxoState}
     */
    static deserialize(raw) {
        const ret = wasm.dustutxostate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustUtxoState.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.dustutxostate_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DustUtxoStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.dustutxostate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.dustutxostate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) DustUtxoState.prototype[Symbol.dispose] = DustUtxoState.prototype.free;

export class EncryptionSecretKey {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EncryptionSecretKey.prototype);
        obj.__wbg_ptr = ptr;
        EncryptionSecretKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptionSecretKeyFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptionsecretkey_free(ptr, 0);
    }
    clear() {
        wasm.encryptionsecretkey_clear(this.__wbg_ptr);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {EncryptionSecretKey}
     */
    static deserialize(raw) {
        const ret = wasm.encryptionsecretkey_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return EncryptionSecretKey.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.encryptionsecretkey_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        EncryptionSecretKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    public_key() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.encryptionsecretkey_public_key(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {Uint8Array} raw
     * @returns {EncryptionSecretKey}
     */
    static taggedDeserialize(raw) {
        const ret = wasm.encryptionsecretkey_taggedDeserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return EncryptionSecretKey.__wrap(ret[0]);
    }
    /**
     * @param {ZswapOffer} offer
     * @returns {boolean}
     */
    test(offer) {
        _assertClass(offer, ZswapOffer);
        const ret = wasm.encryptionsecretkey_test(this.__wbg_ptr, offer.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * @returns {Uint8Array}
     */
    yesIKnowTheSecurityImplicationsOfThis_serialize() {
        const ret = wasm.encryptionsecretkey_yesIKnowTheSecurityImplicationsOfThis_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    yesIKnowTheSecurityImplicationsOfThis_taggedSerialize() {
        const ret = wasm.encryptionsecretkey_yesIKnowTheSecurityImplicationsOfThis_taggedSerialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) EncryptionSecretKey.prototype[Symbol.dispose] = EncryptionSecretKey.prototype.free;

export class Event {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Event.prototype);
        obj.__wbg_ptr = ptr;
        EventFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof Event)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EventFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_event_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    get content() {
        const ret = wasm.event_content(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {Event}
     */
    static deserialize(raw) {
        const ret = wasm.event_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Event.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.event_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        EventFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.event_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get source() {
        const ret = wasm.event_source(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.event_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Event.prototype[Symbol.dispose] = Event.prototype.free;

export class Intent {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Intent.prototype);
        obj.__wbg_ptr = ptr;
        IntentFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntentFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intent_free(ptr, 0);
    }
    /**
     * @returns {any[]}
     */
    get actions() {
        const ret = wasm.intent_actions(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {ContractCallPrototype} call
     * @returns {Intent}
     */
    addCall(call) {
        _assertClass(call, ContractCallPrototype);
        const ret = wasm.intent_addCall(this.__wbg_ptr, call.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Intent.__wrap(ret[0]);
    }
    /**
     * @param {ContractDeploy} deploy
     * @returns {Intent}
     */
    addDeploy(deploy) {
        _assertClass(deploy, ContractDeploy);
        const ret = wasm.intent_addDeploy(this.__wbg_ptr, deploy.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Intent.__wrap(ret[0]);
    }
    /**
     * @param {MaintenanceUpdate} update
     * @returns {Intent}
     */
    addMaintenanceUpdate(update) {
        _assertClass(update, MaintenanceUpdate);
        const ret = wasm.intent_addMaintenanceUpdate(this.__wbg_ptr, update.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Intent.__wrap(ret[0]);
    }
    /**
     * @param {number} segment_id
     * @returns {Intent}
     */
    bind(segment_id) {
        const ret = wasm.intent_bind(this.__wbg_ptr, segment_id);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Intent.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get binding() {
        const ret = wasm.intent_binding(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    constructor() {
        const ret = wasm.intent_construct();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        IntentFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} signature_marker
     * @param {string} proof_marker
     * @param {string} binding_marker
     * @param {Uint8Array} raw
     * @returns {Intent}
     */
    static deserialize(signature_marker, proof_marker, binding_marker, raw) {
        const ptr0 = passStringToWasm0(signature_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(binding_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.intent_deserialize(ptr0, len0, ptr1, len1, ptr2, len2, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Intent.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get dustActions() {
        const ret = wasm.intent_dustActions(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Intent}
     */
    eraseProofs() {
        const ret = wasm.intent_eraseProofs(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Intent.__wrap(ret[0]);
    }
    /**
     * @returns {Intent}
     */
    eraseSignatures() {
        const ret = wasm.intent_eraseSignatures(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Intent.__wrap(ret[0]);
    }
    /**
     * @returns {UnshieldedOffer | undefined}
     */
    get fallibleUnshieldedOffer() {
        const ret = wasm.intent_fallibleUnshieldedOffer(this.__wbg_ptr);
        return ret === 0 ? undefined : UnshieldedOffer.__wrap(ret);
    }
    /**
     * @returns {UnshieldedOffer | undefined}
     */
    get guaranteedUnshieldedOffer() {
        const ret = wasm.intent_guaranteedUnshieldedOffer(this.__wbg_ptr);
        return ret === 0 ? undefined : UnshieldedOffer.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    has_contract_deployments() {
        const ret = wasm.intent_has_contract_deployments(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    has_fallible_offers() {
        const ret = wasm.intent_has_fallible_offers(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    has_fallible_transcripts() {
        const ret = wasm.intent_has_fallible_transcripts(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {number} segment_id
     * @returns {string}
     */
    intentHash(segment_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.intent_intentHash(this.__wbg_ptr, segment_id);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {Date} ttl
     * @returns {Intent}
     */
    static new(ttl) {
        const ret = wasm.intent_new(ttl);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Intent.__wrap(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.intent_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any[]} actions
     */
    set actions(actions) {
        const ptr0 = passArrayJsValueToWasm0(actions, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.intent_set_actions(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} dust_actions
     */
    set dustActions(dust_actions) {
        const ret = wasm.intent_set_dustActions(this.__wbg_ptr, dust_actions);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} offer
     */
    set fallibleUnshieldedOffer(offer) {
        const ret = wasm.intent_set_fallibleUnshieldedOffer(this.__wbg_ptr, offer);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} offer
     */
    set guaranteedUnshieldedOffer(offer) {
        const ret = wasm.intent_set_guaranteedUnshieldedOffer(this.__wbg_ptr, offer);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Date} ttl
     */
    set ttl(ttl) {
        wasm.intent_set_ttl(this.__wbg_ptr, ttl);
    }
    /**
     * @param {number} segment_id
     * @returns {Uint8Array}
     */
    signatureData(segment_id) {
        const ret = wasm.intent_signatureData(this.__wbg_ptr, segment_id);
        return ret;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.intent_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {Date}
     */
    get ttl() {
        const ret = wasm.intent_ttl(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) Intent.prototype[Symbol.dispose] = Intent.prototype.free;

export class IntoUnderlyingByteSource {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
    /**
     * @param {ReadableByteStreamController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    /**
     * @param {ReadableByteStreamController} controller
     */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
     * @returns {ReadableStreamType}
     */
    get type() {
        const ret = wasm.intounderlyingbytesource_type(this.__wbg_ptr);
        return __wbindgen_enum_ReadableStreamType[ret];
    }
}
if (Symbol.dispose) IntoUnderlyingByteSource.prototype[Symbol.dispose] = IntoUnderlyingByteSource.prototype.free;

export class IntoUnderlyingSink {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr, 0);
    }
    /**
     * @param {any} reason
     * @returns {Promise<any>}
     */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
    /**
     * @returns {Promise<any>}
     */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
     * @param {any} chunk
     * @returns {Promise<any>}
     */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
}
if (Symbol.dispose) IntoUnderlyingSink.prototype[Symbol.dispose] = IntoUnderlyingSink.prototype.free;

export class IntoUnderlyingSource {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr, 0);
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
    /**
     * @param {ReadableStreamDefaultController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
}
if (Symbol.dispose) IntoUnderlyingSource.prototype[Symbol.dispose] = IntoUnderlyingSource.prototype.free;

export class IrInsert {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IrInsert.prototype);
        obj.__wbg_ptr = ptr;
        IrInsertFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IrInsertFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_irinsert_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get ir() {
        const ret = wasm.irinsert_ir(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} operation
     * @param {Uint8Array} vk
     */
    constructor(operation, vk) {
        const ret = wasm.irinsert_new(operation, vk);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        IrInsertFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get operation() {
        const ret = wasm.irinsert_operation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.irinsert_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) IrInsert.prototype[Symbol.dispose] = IrInsert.prototype.free;

export class IrRemove {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IrRemove.prototype);
        obj.__wbg_ptr = ptr;
        IrRemoveFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IrRemoveFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_irremove_free(ptr, 0);
    }
    /**
     * @param {any} operation
     */
    constructor(operation) {
        const ret = wasm.irremove_new(operation);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        IrRemoveFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get operation() {
        const ret = wasm.irremove_operation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.irremove_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) IrRemove.prototype[Symbol.dispose] = IrRemove.prototype.free;

export class LedgerParameters {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LedgerParameters.prototype);
        obj.__wbg_ptr = ptr;
        LedgerParametersFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LedgerParametersFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ledgerparameters_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {LedgerParameters}
     */
    static deserialize(raw) {
        const ret = wasm.ledgerparameters_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LedgerParameters.__wrap(ret[0]);
    }
    /**
     * @returns {DustParameters}
     */
    get dust() {
        const ret = wasm.ledgerparameters_dust(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DustParameters.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get feePrices() {
        const ret = wasm.ledgerparameters_feePrices(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {LedgerParameters}
     */
    static initialParameters() {
        const ret = wasm.ledgerparameters_initialParameters();
        return LedgerParameters.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    maxPriceAdjustment() {
        const ret = wasm.ledgerparameters_maxPriceAdjustment(this.__wbg_ptr);
        return ret;
    }
    constructor() {
        const ret = wasm.ledgerparameters_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        LedgerParametersFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} fullness
     * @returns {any}
     */
    normalizeFullness(fullness) {
        const ret = wasm.ledgerparameters_normalizeFullness(this.__wbg_ptr, fullness);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.ledgerparameters_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.ledgerparameters_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {TransactionCostModel}
     */
    get transactionCostModel() {
        const ret = wasm.ledgerparameters_transactionCostModel(this.__wbg_ptr);
        return TransactionCostModel.__wrap(ret);
    }
}
if (Symbol.dispose) LedgerParameters.prototype[Symbol.dispose] = LedgerParameters.prototype.free;

export class LedgerState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LedgerState.prototype);
        obj.__wbg_ptr = ptr;
        LedgerStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LedgerStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ledgerstate_free(ptr, 0);
    }
    /**
     * @param {VerifiedTransaction} transaction
     * @param {TransactionContext} context
     * @returns {any}
     */
    apply(transaction, context) {
        _assertClass(transaction, VerifiedTransaction);
        _assertClass(context, TransactionContext);
        const ret = wasm.ledgerstate_apply(this.__wbg_ptr, transaction.__wbg_ptr, context.__wbg_ptr);
        return ret;
    }
    /**
     * @param {SystemTransaction} tx
     * @param {Date} tblock
     * @returns {Array<any>}
     */
    applySystemTx(tx, tblock) {
        _assertClass(tx, SystemTransaction);
        const ret = wasm.ledgerstate_applySystemTx(this.__wbg_ptr, tx.__wbg_ptr, tblock);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} network_id
     * @returns {LedgerState}
     */
    static blank(network_id) {
        const ptr0 = passStringToWasm0(network_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ledgerstate_blank(ptr0, len0);
        return LedgerState.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    get blockRewardPool() {
        const ret = wasm.ledgerstate_block_reward_pool(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} recipient
     * @returns {bigint}
     */
    bridgeReceiving(recipient) {
        const ptr0 = passStringToWasm0(recipient, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ledgerstate_bridgeReceiving(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {LedgerState}
     */
    static deserialize(raw) {
        const ret = wasm.ledgerstate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LedgerState.__wrap(ret[0]);
    }
    /**
     * @returns {DustState}
     */
    get dust() {
        const ret = wasm.ledgerstate_dust(this.__wbg_ptr);
        return DustState.__wrap(ret);
    }
    /**
     * @param {string} address
     * @returns {ContractState | undefined}
     */
    index(address) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ledgerstate_index(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : ContractState.__wrap(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get lockedPool() {
        const ret = wasm.ledgerstate_locked_pool(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} network_id
     * @param {ZswapChainState} zswap
     */
    constructor(network_id, zswap) {
        const ptr0 = passStringToWasm0(network_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(zswap, ZswapChainState);
        const ret = wasm.ledgerstate_new(ptr0, len0, zswap.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        LedgerStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {LedgerParameters}
     */
    get parameters() {
        const ret = wasm.ledgerstate_parameters(this.__wbg_ptr);
        return LedgerParameters.__wrap(ret);
    }
    /**
     * @param {Date} tblock
     * @param {any} detailed_fullness
     * @param {any} overall_fullness
     * @returns {LedgerState}
     */
    postBlockUpdate(tblock, detailed_fullness, overall_fullness) {
        const ret = wasm.ledgerstate_postBlockUpdate(this.__wbg_ptr, tblock, detailed_fullness, overall_fullness);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LedgerState.__wrap(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get reservePool() {
        const ret = wasm.ledgerstate_reserve_pool(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.ledgerstate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {LedgerParameters} params
     */
    set parameters(params) {
        _assertClass(params, LedgerParameters);
        wasm.ledgerstate_set_parameters(this.__wbg_ptr, params.__wbg_ptr);
    }
    /**
     * @param {string} user_address
     * @param {bigint} amount
     * @param {Date} tblock
     * @returns {LedgerState}
     */
    testingDistributeNight(user_address, amount, tblock) {
        const ptr0 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ledgerstate_testingDistributeNight(this.__wbg_ptr, ptr0, len0, amount, tblock);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LedgerState.__wrap(ret[0]);
    }
    /**
     * @param {string} network_id
     * @param {bigint} locked_pool
     * @param {bigint} reserve_pool
     * @param {bigint} treasury
     * @returns {LedgerState}
     */
    static testingFromGenesis(network_id, locked_pool, reserve_pool, treasury) {
        const ptr0 = passStringToWasm0(network_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ledgerstate_testingFromGenesis(ptr0, len0, locked_pool, reserve_pool, treasury);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LedgerState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} amount
     * @param {Date} tblock
     * @returns {LedgerState}
     */
    testingUnlockToReserve(amount, tblock) {
        const ret = wasm.ledgerstate_testingUnlockToReserve(this.__wbg_ptr, amount, tblock);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LedgerState.__wrap(ret[0]);
    }
    /**
     * @param {bigint} amount
     * @param {Date} tblock
     * @returns {LedgerState}
     */
    testingUnlockToTreasury(amount, tblock) {
        const ret = wasm.ledgerstate_testingUnlockToTreasury(this.__wbg_ptr, amount, tblock);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LedgerState.__wrap(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.ledgerstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} token_type
     * @returns {bigint}
     */
    treasuryBalance(token_type) {
        const ret = wasm.ledgerstate_treasuryBalance(this.__wbg_ptr, token_type);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} recipient
     * @returns {bigint}
     */
    unclaimedBlockRewards(recipient) {
        const ptr0 = passStringToWasm0(recipient, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ledgerstate_unclaimedBlockRewards(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} address
     * @param {ChargedState} state
     * @param {Map<any, any>} balances_map
     * @returns {LedgerState}
     */
    updateIndex(address, state, balances_map) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(state, ChargedState);
        const ret = wasm.ledgerstate_updateIndex(this.__wbg_ptr, ptr0, len0, state.__wbg_ptr, balances_map);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return LedgerState.__wrap(ret[0]);
    }
    /**
     * @returns {UtxoState}
     */
    get utxo() {
        const ret = wasm.ledgerstate_utxo(this.__wbg_ptr);
        return UtxoState.__wrap(ret);
    }
    /**
     * @returns {ZswapChainState}
     */
    get zswap() {
        const ret = wasm.ledgerstate_zswap(this.__wbg_ptr);
        return ZswapChainState.__wrap(ret);
    }
}
if (Symbol.dispose) LedgerState.prototype[Symbol.dispose] = LedgerState.prototype.free;

export class MaintenanceUpdate {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MaintenanceUpdate.prototype);
        obj.__wbg_ptr = ptr;
        MaintenanceUpdateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MaintenanceUpdateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_maintenanceupdate_free(ptr, 0);
    }
    /**
     * @param {bigint} idx
     * @param {any} signature
     * @returns {MaintenanceUpdate}
     */
    addSignature(idx, signature) {
        const ret = wasm.maintenanceupdate_addSignature(this.__wbg_ptr, idx, signature);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return MaintenanceUpdate.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get address() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.maintenanceupdate_address(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get counter() {
        const ret = wasm.maintenanceupdate_counter(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {Uint8Array}
     */
    get dataToSign() {
        const ret = wasm.maintenanceupdate_data_to_sign(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {string} address
     * @param {any[]} updates
     * @param {bigint} counter
     */
    constructor(address, updates, counter) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(updates, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.maintenanceupdate_new(ptr0, len0, ptr1, len1, counter);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        MaintenanceUpdateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any[]}
     */
    get signatures() {
        const ret = wasm.maintenanceupdate_signatures(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.maintenanceupdate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any[]}
     */
    get updates() {
        const ret = wasm.maintenanceupdate_updates(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) MaintenanceUpdate.prototype[Symbol.dispose] = MaintenanceUpdate.prototype.free;

export class MerkleTreeCollapsedUpdate {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MerkleTreeCollapsedUpdate.prototype);
        obj.__wbg_ptr = ptr;
        MerkleTreeCollapsedUpdateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MerkleTreeCollapsedUpdateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_merkletreecollapsedupdate_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {MerkleTreeCollapsedUpdate}
     */
    static deserialize(raw) {
        const ret = wasm.merkletreecollapsedupdate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return MerkleTreeCollapsedUpdate.__wrap(ret[0]);
    }
    /**
     * @param {ZswapChainState} state
     * @param {bigint} start
     * @param {bigint} end
     */
    constructor(state, start, end) {
        _assertClass(state, ZswapChainState);
        const ret = wasm.merkletreecollapsedupdate_new(state.__wbg_ptr, start, end);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        MerkleTreeCollapsedUpdateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.merkletreecollapsedupdate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.merkletreecollapsedupdate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) MerkleTreeCollapsedUpdate.prototype[Symbol.dispose] = MerkleTreeCollapsedUpdate.prototype.free;

export class NoBinding {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NoBinding.prototype);
        obj.__wbg_ptr = ptr;
        NoBindingFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NoBindingFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nobinding_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {NoBinding}
     */
    static deserialize(raw) {
        const ret = wasm.nobinding_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return NoBinding.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get instance() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.nobinding_instance(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} binding
     */
    constructor(binding) {
        const ptr0 = passStringToWasm0(binding, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.nobinding_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        NoBindingFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.nobinding_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.nobinding_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) NoBinding.prototype[Symbol.dispose] = NoBinding.prototype.free;

export class NoProof {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NoProof.prototype);
        obj.__wbg_ptr = ptr;
        NoProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NoProofFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_noproof_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get instance() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.noproof_instance(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    constructor() {
        const ret = wasm.noproof_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        NoProofFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [_compact]
     * @returns {string}
     */
    toString(_compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.noproof_toString(this.__wbg_ptr, isLikeNone(_compact) ? 0xFFFFFF : _compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) NoProof.prototype[Symbol.dispose] = NoProof.prototype.free;

export class PreBinding {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PreBinding.prototype);
        obj.__wbg_ptr = ptr;
        PreBindingFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PreBindingFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_prebinding_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {PreBinding}
     */
    static deserialize(raw) {
        const ret = wasm.prebinding_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PreBinding.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get instance() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.prebinding_instance(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} binding
     */
    constructor(binding) {
        const ptr0 = passStringToWasm0(binding, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.prebinding_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PreBindingFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.prebinding_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.prebinding_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) PreBinding.prototype[Symbol.dispose] = PreBinding.prototype.free;

export class PrePartitionContractCall {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrePartitionContractCallFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_prepartitioncontractcall_free(ptr, 0);
    }
    /**
     * @param {string} address
     * @param {any} entry_point
     * @param {ContractOperation} op
     * @param {PreTranscript} pre_transcript
     * @param {any[]} private_transcript_outputs
     * @param {any} input
     * @param {any} output
     * @param {string} communication_commitment_rand
     * @param {string} key_location
     */
    constructor(address, entry_point, op, pre_transcript, private_transcript_outputs, input, output, communication_commitment_rand, key_location) {
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(op, ContractOperation);
        _assertClass(pre_transcript, PreTranscript);
        const ptr1 = passArrayJsValueToWasm0(private_transcript_outputs, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(communication_commitment_rand, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(key_location, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ret = wasm.prepartitioncontractcall_new(ptr0, len0, entry_point, op.__wbg_ptr, pre_transcript.__wbg_ptr, ptr1, len1, input, output, ptr2, len2, ptr3, len3);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PrePartitionContractCallFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.prepartitioncontractcall_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) PrePartitionContractCall.prototype[Symbol.dispose] = PrePartitionContractCall.prototype.free;

export class PreProof {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PreProof.prototype);
        obj.__wbg_ptr = ptr;
        PreProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PreProofFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_preproof_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {PreProof}
     */
    static deserialize(raw) {
        const ret = wasm.preproof_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PreProof.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get instance() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.preproof_instance(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} data
     */
    constructor(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.preproof_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PreProofFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.preproof_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.preproof_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) PreProof.prototype[Symbol.dispose] = PreProof.prototype.free;

export class PreTranscript {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PreTranscriptFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pretranscript_free(ptr, 0);
    }
    /**
     * @param {QueryContext} context
     * @param {any} program
     * @param {any} comm_comm
     */
    constructor(context, program, comm_comm) {
        _assertClass(context, QueryContext);
        const ret = wasm.pretranscript_new(context.__wbg_ptr, program, comm_comm);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        PreTranscriptFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.pretranscript_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) PreTranscript.prototype[Symbol.dispose] = PreTranscript.prototype.free;

export class Proof {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Proof.prototype);
        obj.__wbg_ptr = ptr;
        ProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProofFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_proof_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {Proof}
     */
    static deserialize(raw) {
        const ret = wasm.proof_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Proof.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get instance() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.proof_instance(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} data
     */
    constructor(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.proof_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ProofFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.proof_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.proof_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Proof.prototype[Symbol.dispose] = Proof.prototype.free;

export class QueryContext {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QueryContext.prototype);
        obj.__wbg_ptr = ptr;
        QueryContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueryContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_querycontext_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get address() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.querycontext_address(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get block() {
        const ret = wasm.querycontext_block(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get comIndices() {
        const ret = wasm.querycontext_com_indices(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get effects() {
        const ret = wasm.querycontext_effects(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} comm
     * @param {bigint} index
     * @returns {QueryContext}
     */
    insertCommitment(comm, index) {
        const ptr0 = passStringToWasm0(comm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.querycontext_insertCommitment(this.__wbg_ptr, ptr0, len0, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryContext.__wrap(ret[0]);
    }
    /**
     * @param {ChargedState} state
     * @param {string} address
     */
    constructor(state, address) {
        _assertClass(state, ChargedState);
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.querycontext_new(state.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        QueryContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} coin
     * @returns {any}
     */
    qualify(coin) {
        const ret = wasm.querycontext_qualify(this.__wbg_ptr, coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} ops
     * @param {CostModel} cost_model
     * @param {any} gas_limit
     * @returns {QueryResults}
     */
    query(ops, cost_model, gas_limit) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.querycontext_query(this.__wbg_ptr, ops, cost_model.__wbg_ptr, gas_limit);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryResults.__wrap(ret[0]);
    }
    /**
     * @param {any} transcript
     * @param {CostModel} cost_model
     * @returns {QueryContext}
     */
    runTranscript(transcript, cost_model) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.querycontext_runTranscript(this.__wbg_ptr, transcript, cost_model.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryContext.__wrap(ret[0]);
    }
    /**
     * @param {any} block
     */
    set block(block) {
        const ret = wasm.querycontext_set_block(this.__wbg_ptr, block);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} effects
     */
    set effects(effects) {
        const ret = wasm.querycontext_set_effects(this.__wbg_ptr, effects);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {ChargedState}
     */
    get state() {
        const ret = wasm.querycontext_state(this.__wbg_ptr);
        return ChargedState.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.querycontext_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {VmStack}
     */
    toVmStack() {
        const ret = wasm.querycontext_toVmStack(this.__wbg_ptr);
        return VmStack.__wrap(ret);
    }
}
if (Symbol.dispose) QueryContext.prototype[Symbol.dispose] = QueryContext.prototype.free;

export class QueryResults {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QueryResults.prototype);
        obj.__wbg_ptr = ptr;
        QueryResultsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueryResultsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_queryresults_free(ptr, 0);
    }
    /**
     * @returns {QueryContext}
     */
    get context() {
        const ret = wasm.queryresults_context(this.__wbg_ptr);
        return QueryContext.__wrap(ret);
    }
    /**
     * @returns {any}
     */
    get events() {
        const ret = wasm.queryresults_events(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get gasCost() {
        const ret = wasm.queryresults_gas_cost(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    constructor() {
        const ret = wasm.queryresults_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        QueryResultsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.queryresults_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) QueryResults.prototype[Symbol.dispose] = QueryResults.prototype.free;

export class ReplaceAuthority {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReplaceAuthority.prototype);
        obj.__wbg_ptr = ptr;
        ReplaceAuthorityFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReplaceAuthorityFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_replaceauthority_free(ptr, 0);
    }
    /**
     * @returns {ContractMaintenanceAuthority}
     */
    get authority() {
        const ret = wasm.replaceauthority_authority(this.__wbg_ptr);
        return ContractMaintenanceAuthority.__wrap(ret);
    }
    /**
     * @param {ContractMaintenanceAuthority} authority
     */
    constructor(authority) {
        _assertClass(authority, ContractMaintenanceAuthority);
        const ret = wasm.replaceauthority_new(authority.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        ReplaceAuthorityFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.replaceauthority_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ReplaceAuthority.prototype[Symbol.dispose] = ReplaceAuthority.prototype.free;

export class SignatureEnabled {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SignatureEnabled.prototype);
        obj.__wbg_ptr = ptr;
        SignatureEnabledFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignatureEnabledFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signatureenabled_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {SignatureEnabled}
     */
    static deserialize(raw) {
        const ret = wasm.signatureenabled_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SignatureEnabled.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get instance() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.signatureenabled_instance(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {any} signature
     */
    constructor(signature) {
        const ret = wasm.signatureenabled_new(signature);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        SignatureEnabledFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.signatureenabled_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.signatureenabled_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get value() {
        const ret = wasm.signatureenabled_value(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) SignatureEnabled.prototype[Symbol.dispose] = SignatureEnabled.prototype.free;

export class SignatureErased {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SignatureErased.prototype);
        obj.__wbg_ptr = ptr;
        SignatureErasedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignatureErasedFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signatureerased_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get instance() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.signatureerased_instance(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    constructor() {
        const ret = wasm.signatureerased_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        SignatureErasedFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [_compact]
     * @returns {string}
     */
    toString(_compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.signatureerased_toString(this.__wbg_ptr, isLikeNone(_compact) ? 0xFFFFFF : _compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) SignatureErased.prototype[Symbol.dispose] = SignatureErased.prototype.free;

export class StateBoundedMerkleTree {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateBoundedMerkleTree.prototype);
        obj.__wbg_ptr = ptr;
        StateBoundedMerkleTreeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateBoundedMerkleTreeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stateboundedmerkletree_free(ptr, 0);
    }
    /**
     * @param {number} height
     */
    constructor(height) {
        const ret = wasm.stateboundedmerkletree_blank(height);
        this.__wbg_ptr = ret >>> 0;
        StateBoundedMerkleTreeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {bigint} start
     * @param {bigint} end
     * @returns {StateBoundedMerkleTree}
     */
    collapse(start, end) {
        const ret = wasm.stateboundedmerkletree_collapse(this.__wbg_ptr, start, end);
        return StateBoundedMerkleTree.__wrap(ret);
    }
    /**
     * @param {any} leaf
     * @param {bigint | null} [index_start]
     * @param {bigint | null} [index_end]
     * @param {boolean | null} [already_hashed]
     * @returns {any}
     */
    findPathForLeaf(leaf, index_start, index_end, already_hashed) {
        const ret = wasm.stateboundedmerkletree_findPathForLeaf(this.__wbg_ptr, leaf, !isLikeNone(index_start), isLikeNone(index_start) ? BigInt(0) : index_start, !isLikeNone(index_end), isLikeNone(index_end) ? BigInt(0) : index_end, isLikeNone(already_hashed) ? 0xFFFFFF : already_hashed ? 1 : 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {number}
     */
    get height() {
        const ret = wasm.stateboundedmerkletree_height(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {bigint} index
     * @param {any} leaf
     * @returns {any}
     */
    pathForLeaf(index, leaf) {
        const ret = wasm.stateboundedmerkletree_pathForLeaf(this.__wbg_ptr, index, leaf);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {StateBoundedMerkleTree}
     */
    rehash() {
        const ret = wasm.stateboundedmerkletree_rehash(this.__wbg_ptr);
        return StateBoundedMerkleTree.__wrap(ret);
    }
    /**
     * @returns {any}
     */
    root() {
        const ret = wasm.stateboundedmerkletree_root(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.stateboundedmerkletree_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {bigint} index
     * @param {any} leaf
     * @returns {StateBoundedMerkleTree}
     */
    update(index, leaf) {
        const ret = wasm.stateboundedmerkletree_update(this.__wbg_ptr, index, leaf);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateBoundedMerkleTree.__wrap(ret[0]);
    }
}
if (Symbol.dispose) StateBoundedMerkleTree.prototype[Symbol.dispose] = StateBoundedMerkleTree.prototype.free;

export class StateMap {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateMap.prototype);
        obj.__wbg_ptr = ptr;
        StateMapFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateMapFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_statemap_free(ptr, 0);
    }
    /**
     * @param {any} key
     * @returns {StateValue | undefined}
     */
    get(key) {
        const ret = wasm.statemap_get(this.__wbg_ptr, key);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateValue.__wrap(ret[0]);
    }
    /**
     * @param {any} key
     * @param {StateValue} value
     * @returns {StateMap}
     */
    insert(key, value) {
        _assertClass(value, StateValue);
        const ret = wasm.statemap_insert(this.__wbg_ptr, key, value.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateMap.__wrap(ret[0]);
    }
    /**
     * @returns {any[]}
     */
    keys() {
        const ret = wasm.statemap_keys(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    constructor() {
        const ret = wasm.statemap_new();
        this.__wbg_ptr = ret >>> 0;
        StateMapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} key
     * @returns {StateMap}
     */
    remove(key) {
        const ret = wasm.statemap_remove(this.__wbg_ptr, key);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateMap.__wrap(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statemap_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) StateMap.prototype[Symbol.dispose] = StateMap.prototype.free;

export class StateValue {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateValue.prototype);
        obj.__wbg_ptr = ptr;
        StateValueFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateValueFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_statevalue_free(ptr, 0);
    }
    /**
     * @param {StateValue} value
     * @returns {StateValue}
     */
    arrayPush(value) {
        _assertClass(value, StateValue);
        const ret = wasm.statevalue_arrayPush(this.__wbg_ptr, value.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {any[] | undefined}
     */
    asArray() {
        const ret = wasm.statevalue_asArray(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @returns {StateBoundedMerkleTree | undefined}
     */
    asBoundedMerkleTree() {
        const ret = wasm.statevalue_asBoundedMerkleTree(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateBoundedMerkleTree.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    asCell() {
        const ret = wasm.statevalue_asCell(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {StateMap | undefined}
     */
    asMap() {
        const ret = wasm.statevalue_asMap(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateMap.__wrap(ret[0]);
    }
    /**
     * @param {any} value
     * @returns {StateValue}
     */
    static decode(value) {
        const ret = wasm.statevalue_decode(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    encode() {
        const ret = wasm.statevalue_encode(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {number}
     */
    logSize() {
        const ret = wasm.statevalue_logSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    constructor() {
        const ret = wasm.statevalue_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        StateValueFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {StateValue}
     */
    static newArray() {
        const ret = wasm.statevalue_newArray();
        return StateValue.__wrap(ret);
    }
    /**
     * @param {StateBoundedMerkleTree} tree
     * @returns {StateValue}
     */
    static newBoundedMerkleTree(tree) {
        _assertClass(tree, StateBoundedMerkleTree);
        const ret = wasm.statevalue_newBoundedMerkleTree(tree.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @param {any} value
     * @returns {StateValue}
     */
    static newCell(value) {
        const ret = wasm.statevalue_newCell(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @param {StateMap} map
     * @returns {StateValue}
     */
    static newMap(map) {
        _assertClass(map, StateMap);
        const ret = wasm.statevalue_newMap(map.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @returns {StateValue}
     */
    static newNull() {
        const ret = wasm.statevalue_newNull();
        return StateValue.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statevalue_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statevalue_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) StateValue.prototype[Symbol.dispose] = StateValue.prototype.free;

export class SystemTransaction {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SystemTransaction.prototype);
        obj.__wbg_ptr = ptr;
        SystemTransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SystemTransactionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_systemtransaction_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {SystemTransaction}
     */
    static deserialize(raw) {
        const ret = wasm.systemtransaction_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SystemTransaction.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.systemtransaction_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        SystemTransactionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.systemtransaction_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.systemtransaction_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) SystemTransaction.prototype[Symbol.dispose] = SystemTransaction.prototype.free;

export class Transaction {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Transaction.prototype);
        obj.__wbg_ptr = ptr;
        TransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transaction_free(ptr, 0);
    }
    /**
     * @param {any} segment
     * @param {Array<any>} calls
     * @param {LedgerParameters} params
     * @param {Date} ttl
     * @param {Array<any> | null} [zswap_inputs]
     * @param {Array<any> | null} [zswap_outputs]
     * @param {Array<any> | null} [zswap_transient]
     * @returns {Transaction}
     */
    addCalls(segment, calls, params, ttl, zswap_inputs, zswap_outputs, zswap_transient) {
        _assertClass(params, LedgerParameters);
        const ret = wasm.transaction_addCalls(this.__wbg_ptr, segment, calls, params.__wbg_ptr, ttl, isLikeNone(zswap_inputs) ? 0 : addToExternrefTable0(zswap_inputs), isLikeNone(zswap_outputs) ? 0 : addToExternrefTable0(zswap_outputs), isLikeNone(zswap_transient) ? 0 : addToExternrefTable0(zswap_transient));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @param {any} segment
     * @param {any} raw_intent
     * @returns {Transaction}
     */
    addIntent(segment, raw_intent) {
        const ret = wasm.transaction_addIntent(this.__wbg_ptr, segment, raw_intent);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @param {any} segment
     * @param {any} raw_offer
     * @returns {Transaction}
     */
    addZswapOffer(segment, raw_offer) {
        const ret = wasm.transaction_addZswapOffer(this.__wbg_ptr, segment, raw_offer);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @returns {Transaction}
     */
    bind() {
        const ret = wasm.transaction_bind(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get bindingRandomness() {
        const ret = wasm.transaction_bindingRandomness(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {LedgerParameters} params
     * @param {boolean | null} [enforce_time_to_dismiss]
     * @returns {any}
     */
    cost(params, enforce_time_to_dismiss) {
        _assertClass(params, LedgerParameters);
        const ret = wasm.transaction_cost(this.__wbg_ptr, params.__wbg_ptr, isLikeNone(enforce_time_to_dismiss) ? 0xFFFFFF : enforce_time_to_dismiss ? 1 : 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} signature_marker
     * @param {string} proof_marker
     * @param {string} binding_marker
     * @param {Uint8Array} raw
     * @returns {Transaction}
     */
    static deserialize(signature_marker, proof_marker, binding_marker, raw) {
        const ptr0 = passStringToWasm0(signature_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(binding_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.transaction_deserialize(ptr0, len0, ptr1, len1, ptr2, len2, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @returns {Transaction}
     */
    eraseProofs() {
        const ret = wasm.transaction_eraseProofs(this.__wbg_ptr);
        return Transaction.__wrap(ret);
    }
    /**
     * @returns {Transaction}
     */
    eraseSignatures() {
        const ret = wasm.transaction_eraseSignatures(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @returns {Map<any, any> | undefined}
     */
    get fallibleOffer() {
        const ret = wasm.transaction_fallibleOffer(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LedgerParameters} params
     * @param {boolean | null} [enforce_time_to_dismiss]
     * @returns {bigint}
     */
    fees(params, enforce_time_to_dismiss) {
        _assertClass(params, LedgerParameters);
        const ret = wasm.transaction_fees(this.__wbg_ptr, params.__wbg_ptr, isLikeNone(enforce_time_to_dismiss) ? 0xFFFFFF : enforce_time_to_dismiss ? 1 : 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {LedgerParameters} params
     * @param {number} n
     * @returns {bigint}
     */
    feesWithMargin(params, n) {
        _assertClass(params, LedgerParameters);
        const ret = wasm.transaction_feesWithMargin(this.__wbg_ptr, params.__wbg_ptr, n);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} network_id
     * @param {any} guaranteed
     * @param {any} fallible
     * @param {any} intent
     * @returns {Transaction}
     */
    static fromParts(network_id, guaranteed, fallible, intent) {
        const ptr0 = passStringToWasm0(network_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.transaction_fromParts(ptr0, len0, guaranteed, fallible, intent);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @param {string} network_id
     * @param {any} guaranteed
     * @param {any} fallible
     * @param {any} intent
     * @returns {Transaction}
     */
    static fromPartsRandomized(network_id, guaranteed, fallible, intent) {
        const ptr0 = passStringToWasm0(network_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.transaction_fromPartsRandomized(ptr0, len0, guaranteed, fallible, intent);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @param {ClaimRewardsTransaction} rewards
     * @returns {Transaction}
     */
    static fromRewards(rewards) {
        _assertClass(rewards, ClaimRewardsTransaction);
        const ret = wasm.transaction_fromRewards(rewards.__wbg_ptr);
        return Transaction.__wrap(ret);
    }
    /**
     * @returns {ZswapOffer | undefined}
     */
    get guaranteedOffer() {
        const ret = wasm.transaction_guaranteedOffer(this.__wbg_ptr);
        return ret === 0 ? undefined : ZswapOffer.__wrap(ret);
    }
    /**
     * @returns {string[]}
     */
    identifiers() {
        const ret = wasm.transaction_identifiers(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} segment
     * @param {bigint | null} [fees]
     * @returns {Map<any, any>}
     */
    imbalances(segment, fees) {
        const ret = wasm.transaction_imbalances(this.__wbg_ptr, segment, isLikeNone(fees) ? 0 : addToExternrefTable0(fees));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Map<any, any> | undefined}
     */
    get intents() {
        const ret = wasm.transaction_intents(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Transaction} other
     * @returns {Transaction}
     */
    merge(other) {
        _assertClass(other, Transaction);
        const ret = wasm.transaction_merge(this.__wbg_ptr, other.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    /**
     * @returns {Transaction}
     */
    mockProve() {
        const ret = wasm.transaction_mockProve(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Transaction.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.transaction_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        TransactionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} provider
     * @param {CostModel} cost_model
     * @returns {Promise<Transaction>}
     */
    prove(provider, cost_model) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.transaction_prove(this.__wbg_ptr, provider, cost_model.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ClaimRewardsTransaction | undefined}
     */
    get rewards() {
        const ret = wasm.transaction_rewards(this.__wbg_ptr);
        return ret === 0 ? undefined : ClaimRewardsTransaction.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.transaction_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Map<any, any> | null} [offers_map]
     */
    set fallibleOffer(offers_map) {
        const ret = wasm.transaction_set_fallibleOffer(this.__wbg_ptr, isLikeNone(offers_map) ? 0 : addToExternrefTable0(offers_map));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} offer
     */
    set guaranteedOffer(offer) {
        const ret = wasm.transaction_set_guaranteedOffer(this.__wbg_ptr, offer);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {Map<any, any> | null} [intents_map]
     */
    set intents(intents_map) {
        const ret = wasm.transaction_set_intents(this.__wbg_ptr, isLikeNone(intents_map) ? 0 : addToExternrefTable0(intents_map));
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transaction_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    transactionHash() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.transaction_transactionHash(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @param {LedgerState} ref_state
     * @param {WellFormedStrictness} strictness
     * @param {Date} tblock
     * @returns {VerifiedTransaction}
     */
    wellFormed(ref_state, strictness, tblock) {
        _assertClass(ref_state, LedgerState);
        _assertClass(strictness, WellFormedStrictness);
        const ret = wasm.transaction_wellFormed(this.__wbg_ptr, ref_state.__wbg_ptr, strictness.__wbg_ptr, tblock);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return VerifiedTransaction.__wrap(ret[0]);
    }
}
if (Symbol.dispose) Transaction.prototype[Symbol.dispose] = Transaction.prototype.free;

export class TransactionContext {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactioncontext_free(ptr, 0);
    }
    /**
     * @param {LedgerState} ref_state
     * @param {any} block_context
     * @param {any} whitelist
     */
    constructor(ref_state, block_context, whitelist) {
        _assertClass(ref_state, LedgerState);
        const ret = wasm.transactioncontext_new(ref_state.__wbg_ptr, block_context, whitelist);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        TransactionContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactioncontext_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) TransactionContext.prototype[Symbol.dispose] = TransactionContext.prototype.free;

export class TransactionCostModel {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionCostModel.prototype);
        obj.__wbg_ptr = ptr;
        TransactionCostModelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionCostModelFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactioncostmodel_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    get baselineCost() {
        const ret = wasm.transactioncostmodel_baselineCost(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {TransactionCostModel}
     */
    static deserialize(raw) {
        const ret = wasm.transactioncostmodel_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return TransactionCostModel.__wrap(ret[0]);
    }
    /**
     * @returns {TransactionCostModel}
     */
    static initialTransactionCostModel() {
        const ret = wasm.transactioncostmodel_initialTransactionCostModel();
        return TransactionCostModel.__wrap(ret);
    }
    constructor() {
        const ret = wasm.transactioncostmodel_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        TransactionCostModelFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {CostModel}
     */
    get runtimeCostModel() {
        const ret = wasm.transactioncostmodel_runtimeCostModel(this.__wbg_ptr);
        return CostModel.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.transactioncostmodel_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactioncostmodel_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) TransactionCostModel.prototype[Symbol.dispose] = TransactionCostModel.prototype.free;

export class TransactionResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TransactionResult.prototype);
        obj.__wbg_ptr = ptr;
        TransactionResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TransactionResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transactionresult_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get error() {
        const ret = wasm.transactionresult_error(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {Event[]}
     */
    get events() {
        const ret = wasm.transactionresult_events(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    constructor() {
        const ret = wasm.transactionresult_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        TransactionResultFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Map<any, any> | undefined}
     */
    get successfulSegments() {
        const ret = wasm.transactionresult_successfulSegments(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactionresult_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.transactionresult_type_(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) TransactionResult.prototype[Symbol.dispose] = TransactionResult.prototype.free;

export class UnshieldedOffer {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UnshieldedOffer.prototype);
        obj.__wbg_ptr = ptr;
        UnshieldedOfferFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UnshieldedOfferFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_unshieldedoffer_free(ptr, 0);
    }
    /**
     * @param {any[]} signatures
     * @returns {UnshieldedOffer}
     */
    addSignatures(signatures) {
        const ptr0 = passArrayJsValueToWasm0(signatures, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.unshieldedoffer_addSignatures(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return UnshieldedOffer.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.unshieldedoffer_construct();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        UnshieldedOfferFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {UnshieldedOffer}
     */
    eraseSignatures() {
        const ret = wasm.unshieldedoffer_eraseSignatures(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return UnshieldedOffer.__wrap(ret[0]);
    }
    /**
     * @returns {any[]}
     */
    get inputs() {
        const ret = wasm.unshieldedoffer_inputs(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {any[]} inputs
     * @param {any[]} outputs
     * @param {any[]} signatures
     * @returns {UnshieldedOffer}
     */
    static new(inputs, outputs, signatures) {
        const ptr0 = passArrayJsValueToWasm0(inputs, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(outputs, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayJsValueToWasm0(signatures, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.unshieldedoffer_new(ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return UnshieldedOffer.__wrap(ret[0]);
    }
    /**
     * @returns {any[]}
     */
    get outputs() {
        const ret = wasm.unshieldedoffer_outputs(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {any[]}
     */
    get signatures() {
        const ret = wasm.unshieldedoffer_signatures(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.unshieldedoffer_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) UnshieldedOffer.prototype[Symbol.dispose] = UnshieldedOffer.prototype.free;

export class UtxoMeta {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UtxoMeta.prototype);
        obj.__wbg_ptr = ptr;
        UtxoMetaFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoMetaFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxometa_free(ptr, 0);
    }
    /**
     * @returns {Date}
     */
    get ctime() {
        const ret = wasm.utxometa_ctime(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Date} ctime
     */
    constructor(ctime) {
        const ret = wasm.utxometa_new(ctime);
        this.__wbg_ptr = ret >>> 0;
        UtxoMetaFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Date} ctime
     */
    set ctime(ctime) {
        const ret = wasm.utxometa_set_ctime(this.__wbg_ptr, ctime);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}
if (Symbol.dispose) UtxoMeta.prototype[Symbol.dispose] = UtxoMeta.prototype.free;

export class UtxoState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UtxoState.prototype);
        obj.__wbg_ptr = ptr;
        UtxoStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtxoStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utxostate_free(ptr, 0);
    }
    /**
     * @param {UtxoState} prior
     * @param {Function | null} [filter_by]
     * @returns {Array<any>}
     */
    delta(prior, filter_by) {
        _assertClass(prior, UtxoState);
        const ret = wasm.utxostate_delta(this.__wbg_ptr, prior.__wbg_ptr, isLikeNone(filter_by) ? 0 : addToExternrefTable0(filter_by));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} user_address
     * @returns {Set<any>}
     */
    filter(user_address) {
        const ptr0 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.utxostate_filter(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} utxo
     * @returns {UtxoMeta | undefined}
     */
    lookupMeta(utxo) {
        const ret = wasm.utxostate_lookupMeta(this.__wbg_ptr, utxo);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : UtxoMeta.__wrap(ret[0]);
    }
    /**
     * @param {Map<any, any>} utxo_map
     * @returns {UtxoState}
     */
    static new(utxo_map) {
        const ret = wasm.utxostate_new(utxo_map);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return UtxoState.__wrap(ret[0]);
    }
    /**
     * @returns {Set<any>}
     */
    get utxos() {
        const ret = wasm.utxostate_utxos(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) UtxoState.prototype[Symbol.dispose] = UtxoState.prototype.free;

export class VerifiedTransaction {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifiedTransaction.prototype);
        obj.__wbg_ptr = ptr;
        VerifiedTransactionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifiedTransactionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiedtransaction_free(ptr, 0);
    }
    /**
     * @returns {Transaction}
     */
    get transaction() {
        const ret = wasm.verifiedtransaction_transaction(this.__wbg_ptr);
        return Transaction.__wrap(ret);
    }
}
if (Symbol.dispose) VerifiedTransaction.prototype[Symbol.dispose] = VerifiedTransaction.prototype.free;

export class VerifierKeyInsert {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifierKeyInsert.prototype);
        obj.__wbg_ptr = ptr;
        VerifierKeyInsertFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifierKeyInsertFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifierkeyinsert_free(ptr, 0);
    }
    /**
     * @param {any} operation
     * @param {ContractOperationVersionedVerifierKey} vk
     */
    constructor(operation, vk) {
        _assertClass(vk, ContractOperationVersionedVerifierKey);
        const ret = wasm.verifierkeyinsert_new(operation, vk.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        VerifierKeyInsertFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get operation() {
        const ret = wasm.verifierkeyinsert_operation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.verifierkeyinsert_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {ContractOperationVersionedVerifierKey}
     */
    get vk() {
        const ret = wasm.verifierkeyinsert_vk(this.__wbg_ptr);
        return ContractOperationVersionedVerifierKey.__wrap(ret);
    }
}
if (Symbol.dispose) VerifierKeyInsert.prototype[Symbol.dispose] = VerifierKeyInsert.prototype.free;

export class VerifierKeyRemove {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifierKeyRemove.prototype);
        obj.__wbg_ptr = ptr;
        VerifierKeyRemoveFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifierKeyRemoveFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifierkeyremove_free(ptr, 0);
    }
    /**
     * @param {any} operation
     * @param {ContractOperationVersion} version
     */
    constructor(operation, version) {
        _assertClass(version, ContractOperationVersion);
        const ret = wasm.verifierkeyremove_new(operation, version.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        VerifierKeyRemoveFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get operation() {
        const ret = wasm.verifierkeyremove_operation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.verifierkeyremove_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {ContractOperationVersion}
     */
    get version() {
        const ret = wasm.verifierkeyremove_version(this.__wbg_ptr);
        return ContractOperationVersion.__wrap(ret);
    }
}
if (Symbol.dispose) VerifierKeyRemove.prototype[Symbol.dispose] = VerifierKeyRemove.prototype.free;

export class VmResults {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VmResults.prototype);
        obj.__wbg_ptr = ptr;
        VmResultsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VmResultsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vmresults_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    get events() {
        const ret = wasm.vmresults_events(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {any}
     */
    get gasCost() {
        const ret = wasm.vmresults_gas_cost(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    constructor() {
        const ret = wasm.vmresults_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {VmStack}
     */
    get stack() {
        const ret = wasm.vmresults_stack(this.__wbg_ptr);
        return VmStack.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.vmresults_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) VmResults.prototype[Symbol.dispose] = VmResults.prototype.free;

export class VmStack {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VmStack.prototype);
        obj.__wbg_ptr = ptr;
        VmStackFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VmStackFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vmstack_free(ptr, 0);
    }
    /**
     * @param {number} idx
     * @returns {StateValue | undefined}
     */
    get(idx) {
        const ret = wasm.vmstack_get(this.__wbg_ptr, idx);
        return ret === 0 ? undefined : StateValue.__wrap(ret);
    }
    /**
     * @param {number} idx
     * @returns {boolean | undefined}
     */
    isStrong(idx) {
        const ret = wasm.vmstack_isStrong(this.__wbg_ptr, idx);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @returns {number}
     */
    length() {
        const ret = wasm.vmstack_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    constructor() {
        const ret = wasm.vmstack_new();
        this.__wbg_ptr = ret >>> 0;
        VmStackFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {StateValue} value
     * @param {boolean} is_strong
     */
    push(value, is_strong) {
        _assertClass(value, StateValue);
        wasm.vmstack_push(this.__wbg_ptr, value.__wbg_ptr, is_strong);
    }
    removeLast() {
        wasm.vmstack_removeLast(this.__wbg_ptr);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.vmstack_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) VmStack.prototype[Symbol.dispose] = VmStack.prototype.free;

export class WellFormedStrictness {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WellFormedStrictnessFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wellformedstrictness_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get enforceBalancing() {
        const ret = wasm.wellformedstrictness_enforce_balancing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get enforceLimits() {
        const ret = wasm.wellformedstrictness_enforce_limits(this.__wbg_ptr);
        return ret !== 0;
    }
    constructor() {
        const ret = wasm.wellformedstrictness_new();
        this.__wbg_ptr = ret >>> 0;
        WellFormedStrictnessFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean} value
     */
    set enforceBalancing(value) {
        wasm.wellformedstrictness_set_enforce_balancing(this.__wbg_ptr, value);
    }
    /**
     * @param {boolean} value
     */
    set enforceLimits(value) {
        wasm.wellformedstrictness_set_enforce_limits(this.__wbg_ptr, value);
    }
    /**
     * @param {boolean} value
     */
    set verifyContractProofs(value) {
        wasm.wellformedstrictness_set_verify_contract_proofs(this.__wbg_ptr, value);
    }
    /**
     * @param {boolean} value
     */
    set verifyNativeProofs(value) {
        wasm.wellformedstrictness_set_verify_native_proofs(this.__wbg_ptr, value);
    }
    /**
     * @param {boolean} value
     */
    set verifySignatures(value) {
        wasm.wellformedstrictness_set_verify_signatures(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get verifyContractProofs() {
        const ret = wasm.wellformedstrictness_verify_contract_proofs(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get verifyNativeProofs() {
        const ret = wasm.wellformedstrictness_verify_native_proofs(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get verifySignatures() {
        const ret = wasm.wellformedstrictness_verify_signatures(this.__wbg_ptr);
        return ret !== 0;
    }
}
if (Symbol.dispose) WellFormedStrictness.prototype[Symbol.dispose] = WellFormedStrictness.prototype.free;

export class ZswapChainState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapChainState.prototype);
        obj.__wbg_ptr = ptr;
        ZswapChainStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapChainStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswapchainstate_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ZswapChainState}
     */
    static deserialize(raw) {
        const ret = wasm.zswapchainstate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapChainState.__wrap(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ZswapChainState}
     */
    static deserializeFromLedgerState(raw) {
        const ret = wasm.zswapchainstate_deserializeFromLedgerState(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapChainState.__wrap(ret[0]);
    }
    /**
     * @param {string} contract_address
     * @returns {ZswapChainState}
     */
    filter(contract_address) {
        const ptr0 = passStringToWasm0(contract_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswapchainstate_filter(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapChainState.__wrap(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get firstFree() {
        const ret = wasm.zswapchainstate_firstFree(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    constructor() {
        const ret = wasm.zswapchainstate_new();
        this.__wbg_ptr = ret >>> 0;
        ZswapChainStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Date} tblock
     * @param {bigint} retention_duration
     * @returns {ZswapChainState}
     */
    postBlockUpdate(tblock, retention_duration) {
        const ret = wasm.zswapchainstate_postBlockUpdate(this.__wbg_ptr, tblock, retention_duration);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapChainState.__wrap(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.zswapchainstate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.zswapchainstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {ZswapOffer} offer
     * @param {any} whitelist
     * @returns {any}
     */
    tryApply(offer, whitelist) {
        _assertClass(offer, ZswapOffer);
        const ret = wasm.zswapchainstate_tryApply(this.__wbg_ptr, offer.__wbg_ptr, whitelist);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
if (Symbol.dispose) ZswapChainState.prototype[Symbol.dispose] = ZswapChainState.prototype.free;

export class ZswapInput {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapInput.prototype);
        obj.__wbg_ptr = ptr;
        ZswapInputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapInputFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswapinput_free(ptr, 0);
    }
    /**
     * @returns {string | undefined}
     */
    get contractAddress() {
        const ret = wasm.zswapinput_contractAddress(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string} proof_marker
     * @param {Uint8Array} raw
     * @returns {ZswapInput}
     */
    static deserialize(proof_marker, raw) {
        const ptr0 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswapinput_deserialize(ptr0, len0, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapInput.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.zswapinput_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ZswapInputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} coin
     * @param {number | null | undefined} segment
     * @param {string} contract
     * @param {ZswapChainState} state
     * @returns {ZswapInput}
     */
    static newContractOwned(coin, segment, contract, state) {
        const ptr0 = passStringToWasm0(contract, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(state, ZswapChainState);
        const ret = wasm.zswapinput_newContractOwned(coin, isLikeNone(segment) ? 0xFFFFFF : segment, ptr0, len0, state.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapInput.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get nullifier() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.zswapinput_nullifier(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get proof() {
        const ret = wasm.zswapinput_proof(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.zswapinput_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.zswapinput_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ZswapInput.prototype[Symbol.dispose] = ZswapInput.prototype.free;

export class ZswapLocalState {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapLocalState.prototype);
        obj.__wbg_ptr = ptr;
        ZswapLocalStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapLocalStateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswaplocalstate_free(ptr, 0);
    }
    /**
     * @param {ZswapSecretKeys} secret_keys
     * @param {ZswapOffer} offer
     * @returns {ZswapLocalState}
     */
    apply(secret_keys, offer) {
        _assertClass(secret_keys, ZswapSecretKeys);
        _assertClass(offer, ZswapOffer);
        const ret = wasm.zswaplocalstate_apply(this.__wbg_ptr, secret_keys.__wbg_ptr, offer.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalState.__wrap(ret[0]);
    }
    /**
     * @param {MerkleTreeCollapsedUpdate} update
     * @returns {ZswapLocalState}
     */
    applyCollapsedUpdate(update) {
        _assertClass(update, MerkleTreeCollapsedUpdate);
        const ret = wasm.zswaplocalstate_applyCollapsedUpdate(this.__wbg_ptr, update.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalState.__wrap(ret[0]);
    }
    /**
     * @param {ZswapOffer} offer
     * @returns {ZswapLocalState}
     */
    applyFailed(offer) {
        _assertClass(offer, ZswapOffer);
        const ret = wasm.zswaplocalstate_applyFailed(this.__wbg_ptr, offer.__wbg_ptr);
        return ZswapLocalState.__wrap(ret);
    }
    /**
     * @param {ZswapSecretKeys} secret_keys
     * @param {ZswapOffer} offer
     * @returns {ZswapLocalStateWithChanges}
     */
    applyWithChanges(secret_keys, offer) {
        _assertClass(secret_keys, ZswapSecretKeys);
        _assertClass(offer, ZswapOffer);
        const ret = wasm.zswaplocalstate_applyWithChanges(this.__wbg_ptr, secret_keys.__wbg_ptr, offer.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalStateWithChanges.__wrap(ret[0]);
    }
    /**
     * @param {Date} _time
     * @returns {ZswapLocalState}
     */
    clearPending(_time) {
        const ret = wasm.zswaplocalstate_clearPending(this.__wbg_ptr, _time);
        return ZswapLocalState.__wrap(ret);
    }
    /**
     * @returns {Set<any>}
     */
    get coins() {
        const ret = wasm.zswaplocalstate_coins(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @returns {ZswapLocalState}
     */
    static deserialize(raw) {
        const ret = wasm.zswaplocalstate_deserialize(raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalState.__wrap(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get firstFree() {
        const ret = wasm.zswaplocalstate_firstFree(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {ZswapSecretKeys} secret_keys
     * @param {any} coin
     * @returns {ZswapLocalState}
     */
    insertCoin(secret_keys, coin) {
        _assertClass(secret_keys, ZswapSecretKeys);
        const ret = wasm.zswaplocalstate_insertCoin(this.__wbg_ptr, secret_keys.__wbg_ptr, coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalState.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get merkleTreeRoot() {
        const ret = wasm.zswaplocalstate_merkle_tree_root(this.__wbg_ptr);
        return ret;
    }
    constructor() {
        const ret = wasm.zswaplocalstate_new();
        this.__wbg_ptr = ret >>> 0;
        ZswapLocalStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Map<any, any>}
     */
    get pendingOutputs() {
        const ret = wasm.zswaplocalstate_pendingOutputs(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Map<any, any>}
     */
    get pendingSpends() {
        const ret = wasm.zswaplocalstate_pendingSpends(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} nullifier
     * @returns {ZswapLocalState}
     */
    removeCoinByNullifier(nullifier) {
        const ptr0 = passStringToWasm0(nullifier, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswaplocalstate_removeCoinByNullifier(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalState.__wrap(ret[0]);
    }
    /**
     * @param {ZswapSecretKeys} secret_keys
     * @param {Event[]} events
     * @returns {ZswapLocalState}
     */
    replayEvents(secret_keys, events) {
        _assertClass(secret_keys, ZswapSecretKeys);
        const ptr0 = passArrayJsValueToWasm0(events, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswaplocalstate_replayEvents(this.__wbg_ptr, secret_keys.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalState.__wrap(ret[0]);
    }
    /**
     * @param {ZswapSecretKeys} secret_keys
     * @param {Event[]} events
     * @returns {ZswapLocalStateWithChanges}
     */
    replayEventsWithChanges(secret_keys, events) {
        _assertClass(secret_keys, ZswapSecretKeys);
        const ptr0 = passArrayJsValueToWasm0(events, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswaplocalstate_replayEventsWithChanges(this.__wbg_ptr, secret_keys.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalStateWithChanges.__wrap(ret[0]);
    }
    /**
     * @param {ZswapSecretKeys} secret_keys
     * @param {Uint8Array} raw_events
     * @returns {ZswapLocalStateWithChanges}
     */
    replayRawEvents(secret_keys, raw_events) {
        _assertClass(secret_keys, ZswapSecretKeys);
        const ptr0 = passArray8ToWasm0(raw_events, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswaplocalstate_replayRawEvents(this.__wbg_ptr, secret_keys.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalStateWithChanges.__wrap(ret[0]);
    }
    /**
     * @param {Transaction} tx
     * @returns {ZswapLocalState}
     */
    revertTransaction(tx) {
        _assertClass(tx, Transaction);
        const ret = wasm.zswaplocalstate_revertTransaction(this.__wbg_ptr, tx.__wbg_ptr);
        return ZswapLocalState.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.zswaplocalstate_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {ZswapSecretKeys} secret_keys
     * @param {any} coin
     * @param {number | null} [segment]
     * @param {Date | null} [_ttl]
     * @returns {any}
     */
    spend(secret_keys, coin, segment, _ttl) {
        _assertClass(secret_keys, ZswapSecretKeys);
        const ret = wasm.zswaplocalstate_spend(this.__wbg_ptr, secret_keys.__wbg_ptr, coin, isLikeNone(segment) ? 0xFFFFFF : segment, isLikeNone(_ttl) ? 0 : addToExternrefTable0(_ttl));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {ZswapSecretKeys} secret_keys
     * @param {any} coin
     * @param {number | null | undefined} segment
     * @param {ZswapOutput} output
     * @param {Date | null} [_ttl]
     * @returns {any}
     */
    spendFromOutput(secret_keys, coin, segment, output, _ttl) {
        _assertClass(secret_keys, ZswapSecretKeys);
        _assertClass(output, ZswapOutput);
        const ret = wasm.zswaplocalstate_spendFromOutput(this.__wbg_ptr, secret_keys.__wbg_ptr, coin, isLikeNone(segment) ? 0xFFFFFF : segment, output.__wbg_ptr, isLikeNone(_ttl) ? 0 : addToExternrefTable0(_ttl));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.zswaplocalstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} coin_public_key
     * @param {any} coin
     * @returns {ZswapLocalState}
     */
    watchFor(coin_public_key, coin) {
        const ptr0 = passStringToWasm0(coin_public_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswaplocalstate_watchFor(this.__wbg_ptr, ptr0, len0, coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapLocalState.__wrap(ret[0]);
    }
}
if (Symbol.dispose) ZswapLocalState.prototype[Symbol.dispose] = ZswapLocalState.prototype.free;

export class ZswapLocalStateWithChanges {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapLocalStateWithChanges.prototype);
        obj.__wbg_ptr = ptr;
        ZswapLocalStateWithChangesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapLocalStateWithChangesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswaplocalstatewithchanges_free(ptr, 0);
    }
    /**
     * @returns {ZswapStateChanges[]}
     */
    get changes() {
        const ret = wasm.zswaplocalstatewithchanges_changes(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {ZswapLocalState}
     */
    get state() {
        const ret = wasm.zswaplocalstatewithchanges_state(this.__wbg_ptr);
        return ZswapLocalState.__wrap(ret);
    }
}
if (Symbol.dispose) ZswapLocalStateWithChanges.prototype[Symbol.dispose] = ZswapLocalStateWithChanges.prototype.free;

export class ZswapOffer {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapOffer.prototype);
        obj.__wbg_ptr = ptr;
        ZswapOfferFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapOfferFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswapoffer_free(ptr, 0);
    }
    /**
     * @returns {Map<any, any>}
     */
    get deltas() {
        const ret = wasm.zswapoffer_deltas(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} proof_marker
     * @param {Uint8Array} raw
     * @returns {ZswapOffer}
     */
    static deserialize(proof_marker, raw) {
        const ptr0 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswapoffer_deserialize(ptr0, len0, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapOffer.__wrap(ret[0]);
    }
    /**
     * @param {ZswapInput} input
     * @param {string | null} [_type]
     * @param {bigint | null} [_value]
     * @returns {ZswapOffer}
     */
    static fromInput(input, _type, _value) {
        _assertClass(input, ZswapInput);
        var ptr0 = isLikeNone(_type) ? 0 : passStringToWasm0(_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswapoffer_fromInput(input.__wbg_ptr, ptr0, len0, isLikeNone(_value) ? 0 : addToExternrefTable0(_value));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapOffer.__wrap(ret[0]);
    }
    /**
     * @param {ZswapOutput} output
     * @param {string | null} [_type]
     * @param {bigint | null} [_value]
     * @returns {ZswapOffer}
     */
    static fromOutput(output, _type, _value) {
        _assertClass(output, ZswapOutput);
        var ptr0 = isLikeNone(_type) ? 0 : passStringToWasm0(_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswapoffer_fromOutput(output.__wbg_ptr, ptr0, len0, isLikeNone(_value) ? 0 : addToExternrefTable0(_value));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapOffer.__wrap(ret[0]);
    }
    /**
     * @param {ZswapTransient} transient
     * @returns {ZswapOffer}
     */
    static fromTransient(transient) {
        _assertClass(transient, ZswapTransient);
        const ret = wasm.zswapoffer_fromTransient(transient.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapOffer.__wrap(ret[0]);
    }
    /**
     * @returns {any[]}
     */
    get inputs() {
        const ret = wasm.zswapoffer_inputs(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {ZswapOffer} other
     * @returns {ZswapOffer}
     */
    merge(other) {
        _assertClass(other, ZswapOffer);
        const ret = wasm.zswapoffer_merge(this.__wbg_ptr, other.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapOffer.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.zswapoffer_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ZswapOfferFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any[]}
     */
    get outputs() {
        const ret = wasm.zswapoffer_outputs(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.zswapoffer_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.zswapoffer_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any[]}
     */
    get transients() {
        const ret = wasm.zswapoffer_transients(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) ZswapOffer.prototype[Symbol.dispose] = ZswapOffer.prototype.free;

export class ZswapOutput {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapOutput.prototype);
        obj.__wbg_ptr = ptr;
        ZswapOutputFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapOutputFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswapoutput_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get commitment() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.zswapoutput_commitment(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    constructor() {
        const ret = wasm.zswapoutput_construct();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ZswapOutputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string | undefined}
     */
    get contractAddress() {
        const ret = wasm.zswapoutput_contractAddress(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string} proof_marker
     * @param {Uint8Array} raw
     * @returns {ZswapOutput}
     */
    static deserialize(proof_marker, raw) {
        const ptr0 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswapoutput_deserialize(ptr0, len0, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapOutput.__wrap(ret[0]);
    }
    /**
     * @param {any} coin
     * @param {number | null | undefined} segment
     * @param {string} target_cpk
     * @param {string} target_epk
     * @returns {ZswapOutput}
     */
    static new(coin, segment, target_cpk, target_epk) {
        const ptr0 = passStringToWasm0(target_cpk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(target_epk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.zswapoutput_new(coin, isLikeNone(segment) ? 0xFFFFFF : segment, ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapOutput.__wrap(ret[0]);
    }
    /**
     * @param {any} coin
     * @param {number | null | undefined} segment
     * @param {string} contract
     * @returns {ZswapOutput}
     */
    static newContractOwned(coin, segment, contract) {
        const ptr0 = passStringToWasm0(contract, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswapoutput_newContractOwned(coin, isLikeNone(segment) ? 0xFFFFFF : segment, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapOutput.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get proof() {
        const ret = wasm.zswapoutput_proof(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.zswapoutput_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.zswapoutput_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ZswapOutput.prototype[Symbol.dispose] = ZswapOutput.prototype.free;

export class ZswapSecretKeys {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapSecretKeys.prototype);
        obj.__wbg_ptr = ptr;
        ZswapSecretKeysFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapSecretKeysFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswapsecretkeys_free(ptr, 0);
    }
    clear() {
        wasm.zswapsecretkeys_clear(this.__wbg_ptr);
    }
    /**
     * @returns {string}
     */
    get coinPublicKey() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.zswapsecretkeys_coinPublicKey(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {CoinSecretKey}
     */
    get coinSecretKey() {
        const ret = wasm.zswapsecretkeys_coinSecretKey(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return CoinSecretKey.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get encryptionPublicKey() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.zswapsecretkeys_encryptionPublicKey(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {EncryptionSecretKey}
     */
    get encryptionSecretKey() {
        const ret = wasm.zswapsecretkeys_encryptionSecretKey(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return EncryptionSecretKey.__wrap(ret[0]);
    }
    /**
     * @param {Uint8Array} seed
     * @returns {ZswapSecretKeys}
     */
    static fromSeed(seed) {
        const ret = wasm.zswapsecretkeys_fromSeed(seed);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapSecretKeys.__wrap(ret[0]);
    }
    /**
     * @param {Uint8Array} seed
     * @returns {ZswapSecretKeys}
     */
    static fromSeedRng(seed) {
        const ret = wasm.zswapsecretkeys_fromSeedRng(seed);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapSecretKeys.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.zswapsecretkeys_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ZswapSecretKeysFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) ZswapSecretKeys.prototype[Symbol.dispose] = ZswapSecretKeys.prototype.free;

/**
 * WASM wrapper for ZswapStateChanges (used by Zswap)
 */
export class ZswapStateChanges {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapStateChanges.prototype);
        obj.__wbg_ptr = ptr;
        ZswapStateChangesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapStateChangesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswapstatechanges_free(ptr, 0);
    }
    /**
     * @param {string} source
     * @param {any[]} received_coins
     * @param {any[]} spent_coins
     */
    constructor(source, received_coins, spent_coins) {
        const ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(received_coins, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayJsValueToWasm0(spent_coins, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.zswapstatechanges_new(ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ZswapStateChangesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Array<any>}
     */
    get receivedCoins() {
        const ret = wasm.zswapstatechanges_receivedCoins(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {string}
     */
    get source() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.zswapstatechanges_source(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {Array<any>}
     */
    get spentCoins() {
        const ret = wasm.zswapstatechanges_spentCoins(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.zswapstatechanges_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ZswapStateChanges.prototype[Symbol.dispose] = ZswapStateChanges.prototype.free;

export class ZswapTransient {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ZswapTransient.prototype);
        obj.__wbg_ptr = ptr;
        ZswapTransientFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ZswapTransientFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_zswaptransient_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get commitment() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.zswaptransient_commitment(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get contractAddress() {
        const ret = wasm.zswaptransient_contractAddress(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @param {string} proof_marker
     * @param {Uint8Array} raw
     * @returns {ZswapTransient}
     */
    static deserialize(proof_marker, raw) {
        const ptr0 = passStringToWasm0(proof_marker, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.zswaptransient_deserialize(ptr0, len0, raw);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapTransient.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get inputProof() {
        const ret = wasm.zswaptransient_inputProof(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    constructor() {
        const ret = wasm.zswaptransient_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ZswapTransientFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} coin
     * @param {number | null | undefined} segment
     * @param {ZswapOutput} output
     * @returns {ZswapTransient}
     */
    static newFromContractOwnedOutput(coin, segment, output) {
        _assertClass(output, ZswapOutput);
        const ret = wasm.zswaptransient_newFromContractOwnedOutput(coin, isLikeNone(segment) ? 0xFFFFFF : segment, output.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ZswapTransient.__wrap(ret[0]);
    }
    /**
     * @returns {string}
     */
    get nullifier() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.zswaptransient_nullifier(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get outputProof() {
        const ret = wasm.zswaptransient_outputProof(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.zswaptransient_serialize(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.zswaptransient_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ZswapTransient.prototype[Symbol.dispose] = ZswapTransient.prototype.free;

/**
 * @param {any} key
 * @returns {string}
 */
export function addressFromKey(key) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.addressFromKey(key);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {bigint} x
 * @returns {bigint}
 */
export function bigIntModFr(x) {
    const ret = wasm.bigIntModFr(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} x
 * @returns {any}
 */
export function bigIntToValue(x) {
    const ret = wasm.bigIntToValue(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * The fullness the node's post-block update takes for a block whose transactions cost
 * `fullness` in all, against the block limits of `params`: `{ readTime, computeTime, blockUsage,
 * bytesWritten, bytesChurned, overall }`, each a `FixedPoint` as the integer `value × 2^64` it
 * holds.
 * @param {LedgerParameters} params
 * @param {any} fullness
 * @returns {any}
 */
export function blockFullness(params, fullness) {
    _assertClass(params, LedgerParameters);
    const ret = wasm.blockFullness(params.__wbg_ptr, fullness);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * The keys of the by-reference children in a node's serialized child list, including those
 * inside embedded children.
 * @param {Uint8Array} children
 * @returns {Array<any>}
 */
export function childRefs(children) {
    const ret = wasm.childRefs(children);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @param {string} coin_public_key
 * @returns {string}
 */
export function coinCommitment(coin, coin_public_key) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(coin_public_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.coinCommitment(coin, ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {any} coin_info
 * @param {CoinSecretKey} coin_secret_key
 * @returns {string}
 */
export function coinNullifier(coin_info, coin_secret_key) {
    let deferred2_0;
    let deferred2_1;
    try {
        _assertClass(coin_secret_key, CoinSecretKey);
        const ret = wasm.coinNullifier(coin_info, coin_secret_key.__wbg_ptr);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} input
 * @param {any} output
 * @param {string} rand
 * @returns {string}
 */
export function communicationCommitment(input, output, rand) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(rand, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.communicationCommitment(input, output, ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @returns {string}
 */
export function communicationCommitmentRandomness() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.communicationCommitmentRandomness();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * The key of the node holding the contract's state, or `null` if the state has no such
 * contract. The node is kept until the next flush.
 * @param {LedgerState} state
 * @param {Uint8Array} address
 * @returns {any}
 */
export function contractStateKey(state, address) {
    _assertClass(state, LedgerState);
    const ret = wasm.contractStateKey(state.__wbg_ptr, address);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * The key of the node holding the contract's zswap state — the zswap state whose commitment tree
 * keeps only the contract's commitments, as the node builds it — or `null` if the state has no
 * such contract. The node is kept until the next flush.
 * @param {LedgerState} state
 * @param {Uint8Array} address
 * @returns {any}
 */
export function contractZswapStateKey(state, address) {
    _assertClass(state, LedgerState);
    const ret = wasm.contractZswapStateKey(state.__wbg_ptr, address);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} serialized_preimage
 * @param {Uint8Array | null} [ir]
 * @returns {Uint8Array}
 */
export function createCheckPayload(serialized_preimage, ir) {
    const ret = wasm.createCheckPayload(serialized_preimage, isLikeNone(ir) ? 0 : addToExternrefTable0(ir));
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} type_
 * @param {any} value
 * @returns {any}
 */
export function createCoinInfo(type_, value) {
    const ptr0 = passStringToWasm0(type_, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createCoinInfo(ptr0, len0, value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} serialized_preimage
 * @param {bigint | null | undefined} overwrite_binding_input
 * @param {any} key_material
 * @returns {Uint8Array}
 */
export function createProvingPayload(serialized_preimage, overwrite_binding_input, key_material) {
    const ret = wasm.createProvingPayload(serialized_preimage, isLikeNone(overwrite_binding_input) ? 0 : addToExternrefTable0(overwrite_binding_input), key_material);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Transaction} tx
 * @param {Map<any, any>} proving_data
 * @returns {Uint8Array}
 */
export function createProvingTransactionPayload(tx, proving_data) {
    _assertClass(tx, Transaction);
    const ret = wasm.createProvingTransactionPayload(tx.__wbg_ptr, proving_data);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} type_
 * @param {any} value
 * @returns {any}
 */
export function createShieldedCoinInfo(type_, value) {
    const ptr0 = passStringToWasm0(type_, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.createShieldedCoinInfo(ptr0, len0, value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} pk
 * @returns {string}
 */
export function decodeCoinPublicKey(pk) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeCoinPublicKey(pk);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {Uint8Array} addr
 * @returns {string}
 */
export function decodeContractAddress(addr) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeContractAddress(addr);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Decodes the value a `log` operation takes (the tagged serialization of a state value) as the
 * VM does: `{ version, eventType, data }`, where `data` is the tagged serialization of the logged
 * state value, or `null` when the data exceeds the VM's emitted-log bound (no log is emitted).
 * @param {Uint8Array} value
 * @returns {any}
 */
export function decodeLogItem(value) {
    const ret = wasm.decodeLogItem(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function decodeQualifiedShieldedCoinInfo(coin) {
    const ret = wasm.decodeQualifiedShieldedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} tt
 * @returns {string}
 */
export function decodeRawTokenType(tt) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeRawTokenType(tt);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function decodeShieldedCoinInfo(coin) {
    const ret = wasm.decodeShieldedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} addr
 * @returns {string}
 */
export function decodeUserAddress(addr) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeUserAddress(addr);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} persistent
 * @returns {any}
 */
export function degradeToTransient(persistent) {
    const ret = wasm.degradeToTransient(persistent);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {string}
 */
export function dummyContractAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.dummyContractAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function dummyUserAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.dummyUserAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} utxo
 * @returns {bigint}
 */
export function dustCommitment(utxo) {
    const ret = wasm.dustCommitment(utxo);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} backing_night
 * @param {bigint} dust_address
 * @returns {bigint}
 */
export function dustFirstNonce(backing_night, dust_address) {
    const ptr0 = passStringToWasm0(backing_night, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.dustFirstNonce(ptr0, len0, dust_address);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} output_no
 * @param {string} intent_hash
 * @returns {string}
 */
export function dustInitialNonce(output_no, intent_hash) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(intent_hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dustInitialNonce(output_no, ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {string} initial_nonce
 * @param {bigint} seq
 * @param {DustSecretKey} sk
 * @returns {bigint}
 */
export function dustNonce(initial_nonce, seq, sk) {
    const ptr0 = passStringToWasm0(initial_nonce, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(sk, DustSecretKey);
    const ret = wasm.dustNonce(ptr0, len0, seq, sk.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} utxo
 * @param {DustSecretKey} sk
 * @returns {bigint}
 */
export function dustNullifier(utxo, sk) {
    _assertClass(sk, DustSecretKey);
    const ret = wasm.dustNullifier(utxo, sk.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {any}
 */
export function ecAdd(a, b) {
    const ret = wasm.ecAdd(a, b);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {any}
 */
export function ecMul(a, b) {
    const ret = wasm.ecMul(a, b);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} val
 * @returns {any}
 */
export function ecMulGenerator(val) {
    const ret = wasm.ecMulGenerator(val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} pk
 * @returns {Uint8Array}
 */
export function encodeCoinPublicKey(pk) {
    const ptr0 = passStringToWasm0(pk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeCoinPublicKey(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} addr
 * @returns {Uint8Array}
 */
export function encodeContractAddress(addr) {
    const ptr0 = passStringToWasm0(addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeContractAddress(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function encodeQualifiedShieldedCoinInfo(coin) {
    const ret = wasm.encodeQualifiedShieldedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} tt
 * @returns {Uint8Array}
 */
export function encodeRawTokenType(tt) {
    const ptr0 = passStringToWasm0(tt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeRawTokenType(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function encodeShieldedCoinInfo(coin) {
    const ret = wasm.encodeShieldedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} addr
 * @returns {Uint8Array}
 */
export function encodeUserAddress(addr) {
    const ptr0 = passStringToWasm0(addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeUserAddress(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} entry_point
 * @returns {string}
 */
export function entryPointHash(entry_point) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.entryPointHash(entry_point);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Drops nodes deleted from the store from this module's caches, so that a node needed again
 * is created and flushed again. Fails, changing nothing, if a live object still holds one of
 * them.
 * @param {Array<any>} keys
 */
export function evictKeys(keys) {
    const ret = wasm.evictKeys(keys);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @returns {any}
 */
export function feeToken() {
    const ret = wasm.feeToken();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Takes the nodes created since the previous flush that are reachable from the keys whose root
 * count rose since then, and the net root-count changes. Returns
 * `{ inserts: { key, data, children }[], rootCounts: { key, delta }[] }`, both in key order;
 * `delta` is the signed change of the key's root count.
 * @returns {any}
 */
export function flushNodes() {
    const ret = wasm.flushNodes();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function hashToCurve(align, val) {
    const ret = wasm.hashToCurve(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Sample a random JubJub scalar, returned as a native field element.
 * @returns {any}
 */
export function jubjubSampleScalar() {
    const ret = wasm.jubjubSampleScalar();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Converts a native field element (BLS12-381 scalar) to a JubJub scalar field element,
 * reducing modulo the JubJub scalar field modulus.
 * @param {any} native
 * @returns {any}
 */
export function jubjubScalarFromNative(native) {
    const ret = wasm.jubjubScalarFromNative(native);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} value
 * @returns {any}
 */
export function leafHash(value) {
    const ret = wasm.leafHash(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Loads the ledger state whose root node has key `stateKey`, reading nodes from `store`
 * synchronously as they are needed. The store stays installed for later reads.
 *
 * `store.get(key)` returns `{ data, children }` or `null`; every node it returns is checked
 * against its key, and a node that does not match aborts the module (the store is corrupt). The
 * store must not call into this module.
 * @param {Uint8Array} state_key
 * @param {any} store
 * @returns {LedgerState}
 */
export function loadState(state_key, store) {
    const ret = wasm.loadState(state_key, store);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return LedgerState.__wrap(ret[0]);
}

/**
 * @param {any} alignment
 * @returns {bigint}
 */
export function maxAlignedSize(alignment) {
    const ret = wasm.maxAlignedSize(alignment);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
}

/**
 * @returns {bigint}
 */
export function maxField() {
    const ret = wasm.maxField();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Returns the largest representable JubJub scalar (i.e. the JubJub scalar field modulus minus one).
 * @returns {bigint}
 */
export function maxJubjubScalar() {
    const ret = wasm.maxJubjubScalar();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Converts a JubJub scalar field element to a native field element (BLS12-381 scalar).
 * @param {any} jubjub
 * @returns {any}
 */
export function nativeFromJubjubScalar(jubjub) {
    const ret = wasm.nativeFromJubjubScalar(jubjub);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {any}
 */
export function nativeToken() {
    const ret = wasm.nativeToken();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} result
 * @returns {Array<any>}
 */
export function parseCheckResult(result) {
    const ret = wasm.parseCheckResult(result);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any[]} calls
 * @param {LedgerParameters} params
 * @returns {Array<any>}
 */
export function partitionTranscripts(calls, params) {
    const ptr0 = passArrayJsValueToWasm0(calls, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(params, LedgerParameters);
    const ret = wasm.partitionTranscripts(ptr0, len0, params.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Raises the root count of `key` by one (reported by the next `flushNodes`).
 * @param {Uint8Array} key
 */
export function persistKey(key) {
    const ret = wasm.persistKey(key);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {any} align
 * @param {any} val
 * @param {any} opening
 * @returns {any}
 */
export function persistentCommit(align, val, opening) {
    const ret = wasm.persistentCommit(align, val, opening);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function persistentHash(align, val) {
    const ret = wasm.persistentHash(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * The post-block update the node runs at the end of every block (`midnight-node`
 * `ledger/src/versions/common/api/ledger.rs` `Ledger::post_block_update`, which
 * `pallet-midnight`'s `on_finalize` calls): `fullness`, the summed cost of the block's
 * transactions, as `blockFullness` gives it against this state's block limits (clamped, never
 * refused), then the ledger's `post_block_update` at `tblock`, whose prevalidation a clamped
 * fullness always passes.
 * @param {LedgerState} state
 * @param {Date} tblock
 * @param {any} fullness
 * @returns {LedgerState}
 */
export function postBlockUpdateExact(state, tblock, fullness) {
    _assertClass(state, LedgerState);
    const ret = wasm.postBlockUpdateExact(state.__wbg_ptr, tblock, fullness);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return LedgerState.__wrap(ret[0]);
}

/**
 * @param {any} input
 * @param {any} output
 * @param {any} public_transcript
 * @param {any} private_transcript_outputs
 * @param {string | null} [key_location]
 * @returns {Uint8Array}
 */
export function proofDataIntoSerializedPreimage(input, output, public_transcript, private_transcript_outputs, key_location) {
    var ptr0 = isLikeNone(key_location) ? 0 : passStringToWasm0(key_location, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.proofDataIntoSerializedPreimage(input, output, public_transcript, private_transcript_outputs, ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} domain_sep
 * @param {string} contract
 * @returns {string}
 */
export function rawTokenType(domain_sep, contract) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(contract, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.rawTokenType(domain_sep, ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * Lowers the root count of `key` by one (reported by the next `flushNodes`).
 * @param {Uint8Array} key
 */
export function releaseKey(key) {
    const ret = wasm.releaseKey(key);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {VmStack} initial
 * @param {any} ops
 * @param {CostModel} cost_model
 * @param {any} gas_limit
 * @returns {VmResults}
 */
export function runProgram(initial, ops, cost_model, gas_limit) {
    _assertClass(initial, VmStack);
    _assertClass(cost_model, CostModel);
    const ret = wasm.runProgram(initial.__wbg_ptr, ops, cost_model.__wbg_ptr, gas_limit);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return VmResults.__wrap(ret[0]);
}

/**
 * @param {any} coin
 * @param {any} recipient
 * @returns {any}
 */
export function runtimeCoinCommitment(coin, recipient) {
    const ret = wasm.runtimeCoinCommitment(coin, recipient);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @param {any} sender_evidence
 * @returns {any}
 */
export function runtimeCoinNullifier(coin, sender_evidence) {
    const ret = wasm.runtimeCoinNullifier(coin, sender_evidence);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {string}
 */
export function sampleCoinPublicKey() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleCoinPublicKey();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function sampleContractAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleContractAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {DustSecretKey}
 */
export function sampleDustSecretKey() {
    const ret = wasm.sampleDustSecretKey();
    return DustSecretKey.__wrap(ret);
}

/**
 * @returns {string}
 */
export function sampleEncryptionPublicKey() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleEncryptionPublicKey();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function sampleIntentHash() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleIntentHash();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function sampleRawTokenType() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleRawTokenType();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string | null} [kind]
 * @returns {any}
 */
export function sampleSigningKey(kind) {
    var ptr0 = isLikeNone(kind) ? 0 : passStringToWasm0(kind, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.sampleSigningKey(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {string}
 */
export function sampleUserAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleUserAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * The tagged serialization of a state value, the input of `decodeLogItem`.
 * @param {StateValue} value
 * @returns {Uint8Array}
 */
export function serializeStateValue(value) {
    _assertClass(value, StateValue);
    const ret = wasm.serializeStateValue(value.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {any}
 */
export function shieldedToken() {
    const ret = wasm.shieldedToken();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} key
 * @param {Uint8Array} data
 * @returns {any}
 */
export function signData(key, data) {
    const ret = wasm.signData(key, data);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} sk
 * @returns {any}
 */
export function signatureVerifyingKey(sk) {
    const ret = wasm.signatureVerifyingKey(sk);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} bytes
 * @returns {any}
 */
export function signingKeyFromBip340(bytes) {
    const ret = wasm.signingKeyFromBip340(bytes);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * The key of this state's root node (32 bytes). The root node is kept in memory until the next
 * `flushNodes`, so persisting the key makes the flush take the state's new nodes.
 * @param {LedgerState} state
 * @returns {Uint8Array}
 */
export function stateKey(state) {
    _assertClass(state, LedgerState);
    const ret = wasm.stateKey(state.__wbg_ptr);
    return ret;
}

/**
 * The state root the node reports for this state (`midnight_ledgerStateRoot`): the serialized
 * typed key of the ledger state.
 * @param {LedgerState} state
 * @returns {Uint8Array}
 */
export function stateRoot(state) {
    _assertClass(state, LedgerState);
    const ret = wasm.stateRoot(state.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * The state's zswap commitment tree's first free index and root, and its DUST commitment and
 * generation trees' first free indexes and roots: `{ zswapFirstFree, zswapRoot,
 * dustCommitmentFirstFree, dustCommitmentRoot, dustGenerationFirstFree, dustGenerationRoot }`,
 * each index a `bigint`, each root its tree's root after `rehash()` in the ledger's untagged
 * serialization.
 * @param {LedgerState} state
 * @returns {any}
 */
export function stateTrees(state) {
    _assertClass(state, LedgerState);
    const ret = wasm.stateTrees(state.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} utxo
 * @param {Date} now
 * @param {bigint} subtract_fee
 * @param {bigint} new_commitment_index
 * @param {any} gen_info
 * @param {DustSecretKey} sk
 * @param {DustParameters} dust_parameters
 * @returns {any}
 */
export function successorDustUtxo(utxo, now, subtract_fee, new_commitment_index, gen_info, sk, dust_parameters) {
    _assertClass(sk, DustSecretKey);
    _assertClass(dust_parameters, DustParameters);
    const ret = wasm.successorDustUtxo(utxo, now, subtract_fee, new_commitment_index, gen_info, sk.__wbg_ptr, dust_parameters.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * A system transaction's cost, which the node adds to the block's fullness (`midnight-node`
 * `ledger/src/versions/common/api/ledger.rs` `Ledger::apply_system_tx`:
 * `tx.cost(&sp.state.parameters)`, with the parameters of the state before it applies).
 * @param {SystemTransaction} transaction
 * @param {LedgerParameters} params
 * @returns {any}
 */
export function systemTransactionCost(transaction, params) {
    _assertClass(transaction, SystemTransaction);
    _assertClass(params, LedgerParameters);
    const ret = wasm.systemTransactionCost(transaction.__wbg_ptr, params.__wbg_ptr);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @param {any} opening
 * @returns {any}
 */
export function transientCommit(align, val, opening) {
    const ret = wasm.transientCommit(align, val, opening);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function transientHash(align, val) {
    const ret = wasm.transientHash(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @returns {any}
 */
export function unshieldedToken() {
    const ret = wasm.unshieldedToken();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Date} ctime
 * @param {bigint} initial_value
 * @param {any} gen_info
 * @param {Date} now
 * @param {any} params
 * @returns {bigint}
 */
export function updatedValue(ctime, initial_value, gen_info, now, params) {
    const ret = wasm.updatedValue(ctime, initial_value, gen_info, now, params);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} transient
 * @returns {any}
 */
export function upgradeFromTransient(transient) {
    const ret = wasm.upgradeFromTransient(transient);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} x
 * @returns {bigint}
 */
export function valueToBigInt(x) {
    const ret = wasm.valueToBigInt(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} key
 * @param {Uint8Array} data
 * @param {any} signature
 * @returns {boolean}
 */
export function verifySignature(key, data, signature) {
    const ret = wasm.verifySignature(key, data, signature);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}
export function __wbg_BigInt_7ea1e749ce6b92fd() { return handleError(function (arg0) {
    const ret = BigInt(arg0);
    return ret;
}, arguments); }
export function __wbg_BigInt_b7bbccdff258c9f2(arg0) {
    const ret = BigInt(arg0);
    return ret;
}
export function __wbg_Error_8c4e43fe74559d73(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_Number_04624de7d0e8332d(arg0) {
    const ret = Number(arg0);
    return ret;
}
export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_bigint_get_as_i64_8fcf4ce7f1ca72a2(arg0, arg1) {
    const v = arg1;
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}
export function __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? v : undefined;
    return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
}
export function __wbg___wbindgen_debug_string_0bc8482c6e3508ae(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_in_47fa6863be6f2f25(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
}
export function __wbg___wbindgen_is_bigint_31b12575b56f32fc(arg0) {
    const ret = typeof(arg0) === 'bigint';
    return ret;
}
export function __wbg___wbindgen_is_function_0095a73b8b156f76(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
}
export function __wbg___wbindgen_is_null_ac34f5003991759a(arg0) {
    const ret = arg0 === null;
    return ret;
}
export function __wbg___wbindgen_is_object_5ae8e5880f2c1fbd(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
}
export function __wbg___wbindgen_is_string_cd444516edc5b180(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
}
export function __wbg___wbindgen_is_undefined_9e4d92534c42d778(arg0) {
    const ret = arg0 === undefined;
    return ret;
}
export function __wbg___wbindgen_jsval_eq_11888390b0186270(arg0, arg1) {
    const ret = arg0 === arg1;
    return ret;
}
export function __wbg___wbindgen_jsval_loose_eq_9dd77d8cd6671811(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
}
export function __wbg___wbindgen_number_get_8ff4255516ccad3e(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}
export function __wbg___wbindgen_shr_ef8e07cce709eb54(arg0, arg1) {
    const ret = arg0 >> arg1;
    return ret;
}
export function __wbg___wbindgen_string_get_72fb696202c56729(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
export function __wbg___wbindgen_throw_be289d5034ed271b(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}
export function __wbg__wbg_cb_unref_d9b87ff7982e3b21(arg0) {
    arg0._wbg_cb_unref();
}
export function __wbg_add_2b0552fe2d2151c8(arg0, arg1) {
    const ret = arg0.add(arg1);
    return ret;
}
export function __wbg_binding_new(arg0) {
    const ret = Binding.__wrap(arg0);
    return ret;
}
export function __wbg_buffer_26d0910f3a5bc899(arg0) {
    const ret = arg0.buffer;
    return ret;
}
export function __wbg_byobRequest_80e594e6da4e1af7(arg0) {
    const ret = arg0.byobRequest;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_byteLength_3417f266f4bf562a(arg0) {
    const ret = arg0.byteLength;
    return ret;
}
export function __wbg_byteOffset_f88547ca47c86358(arg0) {
    const ret = arg0.byteOffset;
    return ret;
}
export function __wbg_call_389efe28435a9388() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments); }
export function __wbg_call_4708e0c13bdc8e95() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments); }
export function __wbg_call_812d25f1510c13c8() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.call(arg1, arg2, arg3);
    return ret;
}, arguments); }
export function __wbg_call_e8c868596c950cf6() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    const ret = arg0.call(arg1, arg2, arg3, arg4);
    return ret;
}, arguments); }
export function __wbg_close_06dfa0a815b9d71f() { return handleError(function (arg0) {
    arg0.close();
}, arguments); }
export function __wbg_close_a79afee31de55b36() { return handleError(function (arg0) {
    arg0.close();
}, arguments); }
export function __wbg_contractcall_new(arg0) {
    const ret = ContractCall.__wrap(arg0);
    return ret;
}
export function __wbg_contractdeploy_new(arg0) {
    const ret = ContractDeploy.__wrap(arg0);
    return ret;
}
export function __wbg_contractstate_new(arg0) {
    const ret = ContractState.__wrap(arg0);
    return ret;
}
export function __wbg_crypto_86f2631e91b51511(arg0) {
    const ret = arg0.crypto;
    return ret;
}
export function __wbg_delete_81a1d6d062f34fe2(arg0, arg1) {
    const ret = arg0.delete(arg1);
    return ret;
}
export function __wbg_done_57b39ecd9addfe81(arg0) {
    const ret = arg0.done;
    return ret;
}
export function __wbg_dustactions_new(arg0) {
    const ret = DustActions.__wrap(arg0);
    return ret;
}
export function __wbg_dustlocalstate_new(arg0) {
    const ret = DustLocalState.__wrap(arg0);
    return ret;
}
export function __wbg_dustregistration_new(arg0) {
    const ret = DustRegistration.__wrap(arg0);
    return ret;
}
export function __wbg_dustspend_new(arg0) {
    const ret = DustSpend.__wrap(arg0);
    return ret;
}
export function __wbg_duststatechanges_new(arg0) {
    const ret = DustStateChanges.__wrap(arg0);
    return ret;
}
export function __wbg_enqueue_2c63f2044f257c3e() { return handleError(function (arg0, arg1) {
    arg0.enqueue(arg1);
}, arguments); }
export function __wbg_entries_58c7934c745daac7(arg0) {
    const ret = Object.entries(arg0);
    return ret;
}
export function __wbg_error_6e6674b292b177aa(arg0, arg1) {
    console.error(getStringFromWasm0(arg0, arg1));
}
export function __wbg_event_new(arg0) {
    const ret = Event.__wrap(arg0);
    return ret;
}
export function __wbg_event_unwrap(arg0) {
    const ret = Event.__unwrap(arg0);
    return ret;
}
export function __wbg_forEach_415aeaf425d269a4(arg0, arg1, arg2) {
    try {
        var state0 = {a: arg1, b: arg2};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue__wasm_bindgen_9720efcf037de6c0___JsValue_____(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        arg0.forEach(cb0);
    } finally {
        state0.a = state0.b = 0;
    }
}
export function __wbg_forEach_e8e16c5ef0959e71(arg0, arg1, arg2) {
    try {
        var state0 = {a: arg1, b: arg2};
        var cb0 = (arg0, arg1, arg2) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue__wasm_bindgen_9720efcf037de6c0___JsValue__js_sys_5d8af86477663cb9___Set_____(a, state0.b, arg0, arg1, arg2);
            } finally {
                state0.a = a;
            }
        };
        arg0.forEach(cb0);
    } finally {
        state0.a = state0.b = 0;
    }
}
export function __wbg_from_bddd64e7d5ff6941(arg0) {
    const ret = Array.from(arg0);
    return ret;
}
export function __wbg_getPrototypeOf_2653517f1dc884d5() { return handleError(function (arg0) {
    const ret = Reflect.getPrototypeOf(arg0);
    return ret;
}, arguments); }
export function __wbg_getRandomValues_b3f15fcbfabb0f8b() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments); }
export function __wbg_getTime_1e3cd1391c5c3995(arg0) {
    const ret = arg0.getTime();
    return ret;
}
export function __wbg_get_9b94d73e6221f75c(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
}
export function __wbg_get_b3ed3ad4be2bc8ac() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments); }
export function __wbg_get_c60162cf03da5a6e(arg0, arg1) {
    const ret = arg0.get(arg1);
    return ret;
}
export function __wbg_get_with_ref_key_1dc361bd10053bfe(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
}
export function __wbg_has_d59deb2491b164c6(arg0, arg1) {
    const ret = arg0.has(arg1);
    return ret;
}
export function __wbg_instanceof_ArrayBuffer_c367199e2fa2aa04(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Date_1b9f15b87f10aa4c(arg0) {
    let result;
    try {
        result = arg0 instanceof Date;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Map_53af74335dec57f4(arg0) {
    let result;
    try {
        result = arg0 instanceof Map;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Promise_0094681e3519d6ec(arg0) {
    let result;
    try {
        result = arg0 instanceof Promise;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Set_bbeda5c95e6ad855(arg0) {
    let result;
    try {
        result = arg0 instanceof Set;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_instanceof_Uint8Array_9b9075935c74707c(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
}
export function __wbg_intent_new(arg0) {
    const ret = Intent.__wrap(arg0);
    return ret;
}
export function __wbg_irinsert_new(arg0) {
    const ret = IrInsert.__wrap(arg0);
    return ret;
}
export function __wbg_irremove_new(arg0) {
    const ret = IrRemove.__wrap(arg0);
    return ret;
}
export function __wbg_isArray_d314bb98fcf08331(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
}
export function __wbg_isSafeInteger_bfbc7332a9768d2a(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
}
export function __wbg_iterator_6ff6560ca1568e55() {
    const ret = Symbol.iterator;
    return ret;
}
export function __wbg_keys_0eee252dfbfa253e(arg0) {
    const ret = arg0.keys();
    return ret;
}
export function __wbg_ledgerstate_new(arg0) {
    const ret = LedgerState.__wrap(arg0);
    return ret;
}
export function __wbg_length_32ed9a279acd054c(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_length_35a7bace40f36eac(arg0) {
    const ret = arg0.length;
    return ret;
}
export function __wbg_maintenanceupdate_new(arg0) {
    const ret = MaintenanceUpdate.__wrap(arg0);
    return ret;
}
export function __wbg_msCrypto_d562bbe83e0d4b91(arg0) {
    const ret = arg0.msCrypto;
    return ret;
}
export function __wbg_new_0_73afc35eb544e539() {
    const ret = new Date();
    return ret;
}
export function __wbg_new_361308b2356cecd0() {
    const ret = new Object();
    return ret;
}
export function __wbg_new_3eb36ae241fe6f44() {
    const ret = new Array();
    return ret;
}
export function __wbg_new_406106b44b3d11fa(arg0) {
    const ret = new Set(arg0);
    return ret;
}
export function __wbg_new_72b49615380db768(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_new_b5d9e2fb389fef91(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue__wasm_bindgen_9720efcf037de6c0___JsValue_____(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
}
export function __wbg_new_dca287b076112a51() {
    const ret = new Map();
    return ret;
}
export function __wbg_new_dd2b680c8bf6ae29(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
}
export function __wbg_new_from_slice_a3d2629dc1826784(arg0, arg1) {
    const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_new_no_args_1c7c842f08d00ebb(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
}
export function __wbg_new_with_byte_offset_and_length_aa261d9c9da49eb1(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
}
export function __wbg_new_with_length_a2c39cbe88fd8ff1(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
}
export function __wbg_next_3482f54c49e8af19() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments); }
export function __wbg_next_418f80d8f5303233(arg0) {
    const ret = arg0.next;
    return ret;
}
export function __wbg_nobinding_new(arg0) {
    const ret = NoBinding.__wrap(arg0);
    return ret;
}
export function __wbg_node_e1f24f89a7336c2e(arg0) {
    const ret = arg0.node;
    return ret;
}
export function __wbg_noproof_new(arg0) {
    const ret = NoProof.__wrap(arg0);
    return ret;
}
export function __wbg_prebinding_new(arg0) {
    const ret = PreBinding.__wrap(arg0);
    return ret;
}
export function __wbg_preproof_new(arg0) {
    const ret = PreProof.__wrap(arg0);
    return ret;
}
export function __wbg_process_3975fd6c72f520aa(arg0) {
    const ret = arg0.process;
    return ret;
}
export function __wbg_proof_new(arg0) {
    const ret = Proof.__wrap(arg0);
    return ret;
}
export function __wbg_prototypesetcall_bdcdcc5842e4d77d(arg0, arg1, arg2) {
    Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
}
export function __wbg_push_8ffdcb2063340ba5(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
}
export function __wbg_queueMicrotask_0aa0a927f78f5d98(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
}
export function __wbg_queueMicrotask_5bb536982f78a56f(arg0) {
    queueMicrotask(arg0);
}
export function __wbg_randomFillSync_f8c153b79f285817() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments); }
export function __wbg_replaceauthority_new(arg0) {
    const ret = ReplaceAuthority.__wrap(arg0);
    return ret;
}
export function __wbg_require_b74f47fc2d022fd6() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments); }
export function __wbg_resolve_002c4b7d9d8f6b64(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
}
export function __wbg_respond_bf6ab10399ca8722() { return handleError(function (arg0, arg1) {
    arg0.respond(arg1 >>> 0);
}, arguments); }
export function __wbg_setTime_7ff687e524801ea2(arg0, arg1) {
    const ret = arg0.setTime(arg1);
    return ret;
}
export function __wbg_set_1eb0999cf5d27fc8(arg0, arg1, arg2) {
    const ret = arg0.set(arg1, arg2);
    return ret;
}
export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
}
export function __wbg_set_6cb8631f80447a67() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    return ret;
}, arguments); }
export function __wbg_set_cc56eefd2dd91957(arg0, arg1, arg2) {
    arg0.set(getArrayU8FromWasm0(arg1, arg2));
}
export function __wbg_set_f43e577aea94465b(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
}
export function __wbg_signatureenabled_new(arg0) {
    const ret = SignatureEnabled.__wrap(arg0);
    return ret;
}
export function __wbg_signatureerased_new(arg0) {
    const ret = SignatureErased.__wrap(arg0);
    return ret;
}
export function __wbg_size_0ffc76d0c4697f79(arg0) {
    const ret = arg0.size;
    return ret;
}
export function __wbg_statevalue_new(arg0) {
    const ret = StateValue.__wrap(arg0);
    return ret;
}
export function __wbg_static_accessor_GLOBAL_12837167ad935116() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_SELF_a621d3dfbb60d0ce() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_static_accessor_WINDOW_f8727f0cf888e0bd() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_subarray_a96e1fef17ed23cb(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
}
export function __wbg_then_0d9fe2c7b1857d32(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
}
export function __wbg_then_b9e7b3b5f1a9e1b5(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
}
export function __wbg_toString_029ac24421fd7a24(arg0) {
    const ret = arg0.toString();
    return ret;
}
export function __wbg_toString_3cadee6e7c22b39e() { return handleError(function (arg0, arg1) {
    const ret = arg0.toString(arg1);
    return ret;
}, arguments); }
export function __wbg_transaction_new(arg0) {
    const ret = Transaction.__wrap(arg0);
    return ret;
}
export function __wbg_transactionresult_new(arg0) {
    const ret = TransactionResult.__wrap(arg0);
    return ret;
}
export function __wbg_valueOf_4f1aacd209b8b72b(arg0) {
    const ret = arg0.valueOf();
    return ret;
}
export function __wbg_value_0546255b415e96c1(arg0) {
    const ret = arg0.value;
    return ret;
}
export function __wbg_verifierkeyinsert_new(arg0) {
    const ret = VerifierKeyInsert.__wrap(arg0);
    return ret;
}
export function __wbg_verifierkeyremove_new(arg0) {
    const ret = VerifierKeyRemove.__wrap(arg0);
    return ret;
}
export function __wbg_versions_4e31226f5e8dc909(arg0) {
    const ret = arg0.versions;
    return ret;
}
export function __wbg_view_6c32e7184b8606ad(arg0) {
    const ret = arg0.view;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
export function __wbg_zswapchainstate_new(arg0) {
    const ret = ZswapChainState.__wrap(arg0);
    return ret;
}
export function __wbg_zswapinput_new(arg0) {
    const ret = ZswapInput.__wrap(arg0);
    return ret;
}
export function __wbg_zswaplocalstate_new(arg0) {
    const ret = ZswapLocalState.__wrap(arg0);
    return ret;
}
export function __wbg_zswapoffer_new(arg0) {
    const ret = ZswapOffer.__wrap(arg0);
    return ret;
}
export function __wbg_zswapoutput_new(arg0) {
    const ret = ZswapOutput.__wrap(arg0);
    return ret;
}
export function __wbg_zswapstatechanges_new(arg0) {
    const ret = ZswapStateChanges.__wrap(arg0);
    return ret;
}
export function __wbg_zswaptransient_new(arg0) {
    const ret = ZswapTransient.__wrap(arg0);
    return ret;
}
export function __wbindgen_cast_0000000000000001(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 3292, function: Function { arguments: [Externref], shim_idx: 3293, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen_9720efcf037de6c0___closure__destroy___dyn_core_ed718c3d60ebd546___ops__function__FnMut__wasm_bindgen_9720efcf037de6c0___JsValue____Output_______, wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue_____);
    return ret;
}
export function __wbindgen_cast_0000000000000002(arg0) {
    // Cast intrinsic for `F64 -> Externref`.
    const ret = arg0;
    return ret;
}
export function __wbindgen_cast_0000000000000003(arg0, arg1) {
    // Cast intrinsic for `I128 -> Externref`.
    const ret = (BigInt.asUintN(64, arg0) | (arg1 << BigInt(64)));
    return ret;
}
export function __wbindgen_cast_0000000000000004(arg0) {
    // Cast intrinsic for `I64 -> Externref`.
    const ret = arg0;
    return ret;
}
export function __wbindgen_cast_0000000000000005(arg0, arg1) {
    // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
    const ret = getArrayU8FromWasm0(arg0, arg1);
    return ret;
}
export function __wbindgen_cast_0000000000000006(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
}
export function __wbindgen_cast_0000000000000007(arg0, arg1) {
    // Cast intrinsic for `U128 -> Externref`.
    const ret = (BigInt.asUintN(64, arg0) | (BigInt.asUintN(64, arg1) << BigInt(64)));
    return ret;
}
export function __wbindgen_cast_0000000000000008(arg0) {
    // Cast intrinsic for `U64 -> Externref`.
    const ret = BigInt.asUintN(64, arg0);
    return ret;
}
export function __wbindgen_cast_0000000000000009(arg0, arg1) {
    var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
    wasm.__wbindgen_free(arg0, arg1 * 4, 4);
    // Cast intrinsic for `Vector(NamedExternref("Event")) -> Externref`.
    const ret = v0;
    return ret;
}
export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
}
function wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue_____(arg0, arg1, arg2) {
    wasm.wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue_____(arg0, arg1, arg2);
}

function wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue__wasm_bindgen_9720efcf037de6c0___JsValue_____(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue__wasm_bindgen_9720efcf037de6c0___JsValue_____(arg0, arg1, arg2, arg3);
}

function wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue__wasm_bindgen_9720efcf037de6c0___JsValue__js_sys_5d8af86477663cb9___Set_____(arg0, arg1, arg2, arg3, arg4) {
    wasm.wasm_bindgen_9720efcf037de6c0___convert__closures_____invoke___wasm_bindgen_9720efcf037de6c0___JsValue__wasm_bindgen_9720efcf037de6c0___JsValue__js_sys_5d8af86477663cb9___Set_____(arg0, arg1, arg2, arg3, arg4);
}


const __wbindgen_enum_ReadableStreamType = ["bytes"];
const AuthorizedClaimFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_authorizedclaim_free(ptr >>> 0, 1));
const BindingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_binding_free(ptr >>> 0, 1));
const ChargedStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chargedstate_free(ptr >>> 0, 1));
const ClaimRewardsTransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_claimrewardstransaction_free(ptr >>> 0, 1));
const CoinSecretKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_coinsecretkey_free(ptr >>> 0, 1));
const ContractCallFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractcall_free(ptr >>> 0, 1));
const ContractCallPrototypeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractcallprototype_free(ptr >>> 0, 1));
const ContractDeployFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractdeploy_free(ptr >>> 0, 1));
const ContractMaintenanceAuthorityFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractmaintenanceauthority_free(ptr >>> 0, 1));
const ContractOperationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractoperation_free(ptr >>> 0, 1));
const ContractOperationVersionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractoperationversion_free(ptr >>> 0, 1));
const ContractOperationVersionedVerifierKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractoperationversionedverifierkey_free(ptr >>> 0, 1));
const ContractStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractstate_free(ptr >>> 0, 1));
const CostModelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_costmodel_free(ptr >>> 0, 1));
const DustActionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustactions_free(ptr >>> 0, 1));
const DustGenerationStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustgenerationstate_free(ptr >>> 0, 1));
const DustGenerationTreeInsertionPathFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustgenerationtreeinsertionpath_free(ptr >>> 0, 1));
const DustLocalStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustlocalstate_free(ptr >>> 0, 1));
const DustLocalStateWithChangesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustlocalstatewithchanges_free(ptr >>> 0, 1));
const DustParametersFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustparameters_free(ptr >>> 0, 1));
const DustRegistrationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustregistration_free(ptr >>> 0, 1));
const DustSecretKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustsecretkey_free(ptr >>> 0, 1));
const DustSpendFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustspend_free(ptr >>> 0, 1));
const DustStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_duststate_free(ptr >>> 0, 1));
const DustStateChangesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_duststatechanges_free(ptr >>> 0, 1));
const DustStateMerkleTreeCollapsedUpdateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_duststatemerkletreecollapsedupdate_free(ptr >>> 0, 1));
const DustUtxoStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dustutxostate_free(ptr >>> 0, 1));
const EncryptionSecretKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encryptionsecretkey_free(ptr >>> 0, 1));
const EventFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_event_free(ptr >>> 0, 1));
const IntentFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intent_free(ptr >>> 0, 1));
const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));
const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1));
const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1));
const IrInsertFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_irinsert_free(ptr >>> 0, 1));
const IrRemoveFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_irremove_free(ptr >>> 0, 1));
const LedgerParametersFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ledgerparameters_free(ptr >>> 0, 1));
const LedgerStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ledgerstate_free(ptr >>> 0, 1));
const MaintenanceUpdateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_maintenanceupdate_free(ptr >>> 0, 1));
const MerkleTreeCollapsedUpdateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_merkletreecollapsedupdate_free(ptr >>> 0, 1));
const NoBindingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nobinding_free(ptr >>> 0, 1));
const NoProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_noproof_free(ptr >>> 0, 1));
const PreBindingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_prebinding_free(ptr >>> 0, 1));
const PrePartitionContractCallFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_prepartitioncontractcall_free(ptr >>> 0, 1));
const PreProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_preproof_free(ptr >>> 0, 1));
const PreTranscriptFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pretranscript_free(ptr >>> 0, 1));
const ProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_proof_free(ptr >>> 0, 1));
const QueryContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_querycontext_free(ptr >>> 0, 1));
const QueryResultsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_queryresults_free(ptr >>> 0, 1));
const ReplaceAuthorityFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_replaceauthority_free(ptr >>> 0, 1));
const SignatureEnabledFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signatureenabled_free(ptr >>> 0, 1));
const SignatureErasedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signatureerased_free(ptr >>> 0, 1));
const StateBoundedMerkleTreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stateboundedmerkletree_free(ptr >>> 0, 1));
const StateMapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_statemap_free(ptr >>> 0, 1));
const StateValueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_statevalue_free(ptr >>> 0, 1));
const SystemTransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_systemtransaction_free(ptr >>> 0, 1));
const TransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transaction_free(ptr >>> 0, 1));
const TransactionContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactioncontext_free(ptr >>> 0, 1));
const TransactionCostModelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactioncostmodel_free(ptr >>> 0, 1));
const TransactionResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_transactionresult_free(ptr >>> 0, 1));
const UnshieldedOfferFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_unshieldedoffer_free(ptr >>> 0, 1));
const UtxoMetaFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxometa_free(ptr >>> 0, 1));
const UtxoStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utxostate_free(ptr >>> 0, 1));
const VerifiedTransactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifiedtransaction_free(ptr >>> 0, 1));
const VerifierKeyInsertFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifierkeyinsert_free(ptr >>> 0, 1));
const VerifierKeyRemoveFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifierkeyremove_free(ptr >>> 0, 1));
const VmResultsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vmresults_free(ptr >>> 0, 1));
const VmStackFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vmstack_free(ptr >>> 0, 1));
const WellFormedStrictnessFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wellformedstrictness_free(ptr >>> 0, 1));
const ZswapChainStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswapchainstate_free(ptr >>> 0, 1));
const ZswapInputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswapinput_free(ptr >>> 0, 1));
const ZswapLocalStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswaplocalstate_free(ptr >>> 0, 1));
const ZswapLocalStateWithChangesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswaplocalstatewithchanges_free(ptr >>> 0, 1));
const ZswapOfferFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswapoffer_free(ptr >>> 0, 1));
const ZswapOutputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswapoutput_free(ptr >>> 0, 1));
const ZswapSecretKeysFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswapsecretkeys_free(ptr >>> 0, 1));
const ZswapStateChangesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswapstatechanges_free(ptr >>> 0, 1));
const ZswapTransientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_zswaptransient_free(ptr >>> 0, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;


let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
