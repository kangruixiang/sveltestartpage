
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Card.svelte generated by Svelte v3.46.2 */

    const { console: console_1 } = globals;
    const file$2 = "src\\components\\Card.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (9:0) {#each site as site}
    function create_each_block(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*site*/ ctx[0].name + "";
    	let t0;
    	let div0_onclick_value;
    	let t1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div0, "class", "text-lg py-2 px-2 w-full mx-2 cursor-pointer text-stone-200 hover:bg-stone-900 hover:rounded-lg");
    			attr_dev(div0, "onclick", div0_onclick_value = "location.href='" + /*site*/ ctx[0].url + "'\r\n\t\t\t");
    			add_location(div0, file$2, 10, 2, 136);
    			attr_dev(div1, "class", "flex flex-row");
    			add_location(div1, file$2, 9, 1, 105);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*site*/ 1 && t0_value !== (t0_value = /*site*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*site*/ 1 && div0_onclick_value !== (div0_onclick_value = "location.href='" + /*site*/ ctx[0].url + "'\r\n\t\t\t")) {
    				attr_dev(div0, "onclick", div0_onclick_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(9:0) {#each site as site}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*site*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*site*/ 1) {
    				each_value = /*site*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { site } = $$props;
    	console.log(site);
    	const writable_props = ['site'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('site' in $$props) $$invalidate(0, site = $$props.site);
    	};

    	$$self.$capture_state = () => ({ site });

    	$$self.$inject_state = $$props => {
    		if ('site' in $$props) $$invalidate(0, site = $$props.site);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [site];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { site: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*site*/ ctx[0] === undefined && !('site' in props)) {
    			console_1.warn("<Card> was created without expected prop 'site'");
    		}
    	}

    	get site() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set site(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Canvas.svelte generated by Svelte v3.46.2 */
    const file$1 = "src\\components\\Canvas.svelte";

    function create_fragment$1(ctx) {
    	let div8;
    	let div1;
    	let div0;
    	let t1;
    	let card0;
    	let t2;
    	let div3;
    	let div2;
    	let t4;
    	let card1;
    	let t5;
    	let div5;
    	let div4;
    	let t7;
    	let card2;
    	let t8;
    	let div7;
    	let div6;
    	let t10;
    	let card3;
    	let current;

    	card0 = new Card({
    			props: { site: /*school*/ ctx[0] },
    			$$inline: true
    		});

    	card1 = new Card({
    			props: { site: /*personal*/ ctx[1] },
    			$$inline: true
    		});

    	card2 = new Card({
    			props: { site: /*social*/ ctx[2] },
    			$$inline: true
    		});

    	card3 = new Card({
    			props: { site: /*finance*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Wake";
    			t1 = space();
    			create_component(card0.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "Personal";
    			t4 = space();
    			create_component(card1.$$.fragment);
    			t5 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div4.textContent = "Social";
    			t7 = space();
    			create_component(card2.$$.fragment);
    			t8 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div6.textContent = "Finance";
    			t10 = space();
    			create_component(card3.$$.fragment);
    			attr_dev(div0, "class", "card-title");
    			add_location(div0, file$1, 13, 2, 245);
    			attr_dev(div1, "class", "w-1/4 py-2 rounded-md mx-6");
    			add_location(div1, file$1, 12, 1, 201);
    			attr_dev(div2, "class", "card-title");
    			add_location(div2, file$1, 20, 2, 375);
    			attr_dev(div3, "class", "w-1/4 py-2 rounded-md mx-6");
    			add_location(div3, file$1, 19, 1, 331);
    			attr_dev(div4, "class", "card-title");
    			add_location(div4, file$1, 26, 2, 508);
    			attr_dev(div5, "class", "w-1/4 py-2 rounded-md mx-6");
    			add_location(div5, file$1, 25, 1, 464);
    			attr_dev(div6, "class", "card-title");
    			add_location(div6, file$1, 32, 2, 637);
    			attr_dev(div7, "class", "w-1/4 py-2 rounded-md mx-6");
    			add_location(div7, file$1, 31, 1, 593);
    			attr_dev(div8, "class", "flex w-full my-auto");
    			add_location(div8, file$1, 11, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			mount_component(card0, div1, null);
    			append_dev(div8, t2);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t4);
    			mount_component(card1, div3, null);
    			append_dev(div8, t5);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t7);
    			mount_component(card2, div5, null);
    			append_dev(div8, t8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t10);
    			mount_component(card3, div7, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card0_changes = {};
    			if (dirty & /*school*/ 1) card0_changes.site = /*school*/ ctx[0];
    			card0.$set(card0_changes);
    			const card1_changes = {};
    			if (dirty & /*personal*/ 2) card1_changes.site = /*personal*/ ctx[1];
    			card1.$set(card1_changes);
    			const card2_changes = {};
    			if (dirty & /*social*/ 4) card2_changes.site = /*social*/ ctx[2];
    			card2.$set(card2_changes);
    			const card3_changes = {};
    			if (dirty & /*finance*/ 8) card3_changes.site = /*finance*/ ctx[3];
    			card3.$set(card3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card0.$$.fragment, local);
    			transition_in(card1.$$.fragment, local);
    			transition_in(card2.$$.fragment, local);
    			transition_in(card3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card0.$$.fragment, local);
    			transition_out(card1.$$.fragment, local);
    			transition_out(card2.$$.fragment, local);
    			transition_out(card3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_component(card0);
    			destroy_component(card1);
    			destroy_component(card2);
    			destroy_component(card3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Canvas', slots, []);
    	let { school } = $$props;
    	let { personal } = $$props;
    	let { social } = $$props;
    	let { finance } = $$props;
    	const writable_props = ['school', 'personal', 'social', 'finance'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Canvas> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('school' in $$props) $$invalidate(0, school = $$props.school);
    		if ('personal' in $$props) $$invalidate(1, personal = $$props.personal);
    		if ('social' in $$props) $$invalidate(2, social = $$props.social);
    		if ('finance' in $$props) $$invalidate(3, finance = $$props.finance);
    	};

    	$$self.$capture_state = () => ({ Card, school, personal, social, finance });

    	$$self.$inject_state = $$props => {
    		if ('school' in $$props) $$invalidate(0, school = $$props.school);
    		if ('personal' in $$props) $$invalidate(1, personal = $$props.personal);
    		if ('social' in $$props) $$invalidate(2, social = $$props.social);
    		if ('finance' in $$props) $$invalidate(3, finance = $$props.finance);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [school, personal, social, finance];
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			school: 0,
    			personal: 1,
    			social: 2,
    			finance: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Canvas",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*school*/ ctx[0] === undefined && !('school' in props)) {
    			console.warn("<Canvas> was created without expected prop 'school'");
    		}

    		if (/*personal*/ ctx[1] === undefined && !('personal' in props)) {
    			console.warn("<Canvas> was created without expected prop 'personal'");
    		}

    		if (/*social*/ ctx[2] === undefined && !('social' in props)) {
    			console.warn("<Canvas> was created without expected prop 'social'");
    		}

    		if (/*finance*/ ctx[3] === undefined && !('finance' in props)) {
    			console.warn("<Canvas> was created without expected prop 'finance'");
    		}
    	}

    	get school() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set school(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get personal() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set personal(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get social() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set social(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get finance() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set finance(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let container;
    	let canvas;
    	let current;
    	const canvas_spread_levels = [/*sites*/ ctx[0]];
    	let canvas_props = {};

    	for (let i = 0; i < canvas_spread_levels.length; i += 1) {
    		canvas_props = assign(canvas_props, canvas_spread_levels[i]);
    	}

    	canvas = new Canvas({ props: canvas_props, $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			container = element("container");
    			create_component(canvas.$$.fragment);
    			attr_dev(container, "class", "flex justify-center flex-row min-w-[80%]");
    			add_location(container, file, 690, 1, 14108);
    			attr_dev(main, "class", "text-center p-4 mx-auto h-full flex justify-center flex-row");
    			add_location(main, file, 689, 0, 14030);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, container);
    			mount_component(canvas, container, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const canvas_changes = (dirty & /*sites*/ 1)
    			? get_spread_update(canvas_spread_levels, [get_spread_object(/*sites*/ ctx[0])])
    			: {};

    			canvas.$set(canvas_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(canvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(canvas);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const sites = {
    		"school": [
    			{
    				"name": "Medhub",
    				"url": "https://wfbmc.medhub.com"
    			},
    			{
    				"name": "Citrix",
    				"url": "https://portal2.wakehealth.edu"
    			},
    			{
    				"name": "Intranet",
    				"url": "https://intranet.wakehealth.edu/index.htm"
    			},
    			{
    				"name": "Outlook",
    				"url": "https://outlook.office365.com"
    			},
    			{
    				"name": "MKSAP",
    				"url": "https://mksap18.acponline.org/"
    			}
    		],
    		"personal": [
    			{
    				"name": "Calendar",
    				"url": "https://www.google.com/calendar/"
    			},
    			{
    				"name": "Todoist",
    				"url": "https://beta.todoist.com/app/"
    			},
    			{
    				"name": "Drafts",
    				"url": "https://draftin.com/documents"
    			},
    			{
    				"name": "Drive",
    				"url": "https://drive.google.com"
    			},
    			{
    				"name": "Random Evernote",
    				"url": "https://evernote-random.glitch.me/"
    			}
    		],
    		"social": [
    			{
    				"name": "Reddit",
    				"url": "http://old.reddit.com"
    			},
    			{
    				"name": "Youtube",
    				"url": "https://youtube.com"
    			},
    			{
    				"name": "Messages",
    				"url": "https://messages.google.com/web/"
    			},
    			{
    				"name": "Telegram",
    				"url": "https://web.telegram.org/"
    			},
    			{
    				"name": "Gmail",
    				"url": "https://gmail.com"
    			},
    			{
    				"name": "Inoreader",
    				"url": "https://www.inoreader.com/"
    			}
    		],
    		"finance": [
    			{
    				"name": "Dicover",
    				"url": "https://card.discover.com"
    			},
    			{
    				"name": "Truliant",
    				"url": "https://www.truliantfcuonline.org/tob/live/usp-core/app/login/consumer"
    			},
    			{
    				"name": "Ally",
    				"url": "https://secure.ally.com/"
    			},
    			{
    				"name": "Vanguard",
    				"url": "https://personal.vanguard.com/us/MyHome"
    			},
    			{
    				"name": "Fedloan",
    				"url": "https://accountaccess.myfedloan.org/accountAccess/index.cfm?event=common.home"
    			},
    			{
    				"name": "YNAB",
    				"url": "https://app.youneedabudget.com/"
    			}
    		]
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Canvas, sites });
    	return [sites];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
