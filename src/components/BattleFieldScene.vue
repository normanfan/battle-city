<template>
    <screen>
        <hud></hud>
        <g className="battle-field" :transform="`translate(${B},${B})`">
            <rect :width="13 * B" :height="13 * B" fill="#000000" />
            <brick-layer :bricks="bricks"></brick-layer>
            <steel-layer :steels="steels"></steel-layer>
            <eagle v-if="eagle" :x="eagle.x" :y="eagle.y" :broken="eagle.broken"></eagle>
            <g className="tank-layer">
                <tank v-for="tank in activeTanks" :key="tank.tankId" :tank="tank">
                </tank>
            </g>
            <g class="bullet-layer">
                <bullet v-for="(bullet, index) in bullets" :x="bullet.x" :y="bullet.y" :direction="bullet.direction" :key="index"></bullet>
            </g>
        </g>
    </screen>
</template>
<script>

import Hud from "../components/HUD.vue"
import Screen from "../components/Screen.vue"
import SteelLayer from './SteelLayer.vue'
import { BLOCK_SIZE as B } from '../utils/constants'
import Eagle from './Eagle.vue'
import BrickLayer from './BrickLayer'
import tanks from '../store/modules/tanks';
import Tank from './tanks.vue'
import Bullet from './Bullet'
export default {
    props: {
        tank: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            map:this.$store.getters.map,
            B,
            x: 0,
            y: 0,
        }
    },
    created() {
   
    },
    mounted() {

    },
    computed: {
        eagle() {
            return this.map.toObject().eagle.toObject();
        },
        steels() {
            return this.map.toObject().steels;
        },
        bricks() {
            return this.map.toObject().bricks;
        },
        tanks() {
            return this.$store.getters.tanks;
        },
        activeTanks() {
            return this.tanks.filter(t => t.active).toObject();
        },
        bullets() {
            return this.$store.getters.bullets;
        }
    },
    created() {

    },
    methods: {
       
    },
    components: {
        Screen,
        Hud,
        SteelLayer,
        Eagle,
        BrickLayer, Tank,
        Bullet
    }

}
</script>
<style lang="less" scoped>
</style>
