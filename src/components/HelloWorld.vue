<template>
        <div style="margin-bottom: 20px;position: relative">
            <el-dialog
                    title="注意"
                    :visible.sync="dialogVisible"
                    width="30%">
                <span>搜索内容不能为空</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-row type="flex" justify="center" class="soft-header">
                <el-col :xs="20" :sm="20" :lg="17" :xl="10">
                    <el-menu default-active="1"
                             class="el-menu-demo"
                             mode="horizontal"
                             @select="handleSelect"
                             style="margin-bottom: 20px; ">
                        <el-menu-item index="1">腾讯</el-menu-item>
                        <el-menu-item index="2">360</el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
            <!-- 搜索框 -->
            <el-row type="flex" justify="center">
                <el-col :xs="20" :sm="20" :lg="17" :xl="10">
                    <el-input placeholder="请输入内容" v-model="searchKeyword" class="search-input">
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 列表 -->
            <el-row type="flex" justify="center" id="softList" class="soft-list">
                <el-col :xs="20" :sm="20" :lg="17" :xl="10">
                    <el-table
                            :data="tableData"
                            stripe
                            ref="softTable"
                            style="width: 100%"
                            @expand-change="handleExpanded">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="soft-table-expand">
                                    <el-form-item label="软件名称">
                                        <span>{{ props.row.softName }}</span>
                                    </el-form-item>
                                    <el-form-item label="软件版本">
                                        <span>{{ props.row.versionName }}</span>
                                    </el-form-item>
                                    <el-form-item label="更新时间">
                                        <span>{{ props.row.updateTime }}</span>
                                    </el-form-item>
                                    <el-form-item label="下载大小">
                                        <span>{{ props.row.fileSize }}</span>
                                    </el-form-item>
                                    <el-form-item label="包含插件" v-if="props.row.pluginInfo">
                                        <span>{{ props.row.pluginInfo }}</span>
                                    </el-form-item>
                                    <el-form-item label="软件评分">
                                        <el-rate
                                                class="soft-rate"
                                                v-model="props.row.point"
                                                disabled
                                                text-color="#ff9900">
                                        </el-rate>
                                    </el-form-item>
                                    <el-form-item label="收费机制">
                                        <span>{{ props.row.isFree? '免费':'付费'}}</span>
                                    </el-form-item>
                                    <el-form-item label="试用时长" v-if="props.row.trial">
                                        <span>{{ props.row.trial }} <span v-if="provider === 'tencent'">天</span></span>
                                    </el-form-item>
                                    <el-form-item label="本次更新" v-if="props.row.whatsNew">
                                        <span>{{ props.row.whatsNew }}</span>
                                    </el-form-item>
                                    <el-form-item label="软件介绍" v-if="props.row.softDesc">
                                        <span>{{ props.row.softDesc }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                                width="100"
                        >
                            <template slot-scope="scope">
                                <el-image
                                        v-if="provider === 'tencent'"
                                        style="margin: 5px;width: 48px; height: 48px"
                                        :src="scope.row.logo.toLowerCase()"
                                        fit="cover"></el-image>
                                <el-image
                                        v-if="provider === '360'"
                                        style="margin: 5px;width: 48px; height: 48px"
                                        :src="scope.row.logo"
                                        fit="cover"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="softName"
                                label="名称"
                                width="220">
                            <template slot-scope="scope">
                                <div class="soft-name">
                                    {{ scope.row.softName }}
                                </div>
                                <div class="soft-feature">
                                    {{ scope.row.feature }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="versionName"
                                label="版本"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="updateTime"
                                label="更新日期">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                width="100"
                        >
                            <template slot-scope="scope">
                                <div>
                                    <el-link type="primary" rel="noreferrer" :href="scope.row.downloadLink" target="_blank">下载</el-link>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center" style="margin-top: 20px" v-show="pageChange.Show" ref="pageChange">
                <el-col :xs="20" :lg="17" :xl="10">
                        <el-button
                                type="primary"
                                icon="el-icon-arrow-left"
                                :disabled="pageChange.Last.Disable"
                                :loading="pageChange.Last.Loading"
                                @click="handleLastPage"
                                circle
                        ></el-button>
                        <span style="margin-left: 20px;margin-right: 20px;">
                            {{ pageNow }}
                        </span>
                        <el-button
                                type="primary"
                                icon="el-icon-arrow-right"
                                :disabled="pageChange.Next.Disable"
                                :loading="pageChange.Next.Loading"
                                @click="handleNextPage"
                                circle
                        ></el-button>
                </el-col>
            </el-row>
            <el-backtop target=".soft-header .soft-list" visibility-height="10"></el-backtop>
        </div>
</template>

<script>
    import {search} from '../request/http'

    export default {
        data: function () {
            return {
                //tencent 腾讯    360  360软件管家
                provider: 'tencent',
                oldSelect: '1',
                dialogVisible: false,
                searchKeyword: '',
                tableData: [],
                pageNow: 1,
                pageChange: {
                    Show: false,
                    Last: {
                        Disable: true,
                        Loading: false
                    },
                    Next: {
                        Disable: false,
                        Loading: false
                    },
                }
            };
        },
        methods: {
            handleSearch() {
                if (this.searchKeyword.trim() === '') {
                    this.dialogVisible = true;
                } else {
                    const loading = this.$loading({
                        lock: true,
                        text: '正在搜索：' + this.searchKeyword,
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    search({
                        _provider: this.provider,
                        keyword: this.searchKeyword,
                        num: 30,
                        page: 1
                    })
                        .then(res => {
                            loading.close();
                            this.tableData = res;
                            if (this.tableData.length === 30 && this.provider === 'tencent') {
                                this.pageChange.Show = true;
                            }
                        })
                }
            },
            handleExpanded(row, expands) {
                if (expands.length > 1) {
                    this.$refs.softTable.toggleRowExpansion(expands[0], false)
                }
            },
            handleLastPage() {
                if (this.pageNow === 1) {
                    this.$alert('当前已经是第一页了，不能再往上翻了', '错误', {
                        confirmButtonText: '确定'
                    });
                } else {
                    this.togglePageButtonLoading(true);
                    search({
                        keyword: this.searchKeyword,
                        num: 30,
                        page: this.pageNow - 1
                    })
                        .then(res => {
                            this.pageNow--;
                            this.tableData = res;
                            this.togglePageButtonLoading(false);
                            this.goTop();
                        })
                }
            },
            handleNextPage() {
                if (this.tableData.length < 30) {
                    this.$alert('没有更多数据了', '错误', {
                        confirmButtonText: '确定'
                    });
                } else {
                    this.togglePageButtonLoading(true);
                    search({
                        keyword: this.searchKeyword,
                        num: 30,
                        page: this.pageNow + 1
                    })
                        .then(res => {
                            this.pageNow++;
                            this.tableData = res;
                            this.togglePageButtonLoading(false);
                            this.goTop();
                        })
                }
            },
            togglePageButtonLoading(b) {
                this.pageChange.Last.Loading = b;
                this.pageChange.Next.Loading = b;
            },
            goTop () {
                this.timer = setInterval(() => {
                    let osTop = document.documentElement.scrollTop || document.body.scrollTop;
                    let iSpeed = Math.floor(-osTop / 5);
                    document.documentElement.scrollTop = document.body.scrollTop = osTop + iSpeed;
                    if (osTop === 0) {
                        clearInterval(this.timer)
                    }
                }, 20)
            },
            handleSelect(key){
                if(this.oldSelect !== key){
                    this.tableData = [];
                    this.oldSelect = key;
                }
                switch (key) {
                    case "1":
                        this.provider = "tencent";
                        break;
                    case "2":
                        this.provider = "360";
                        break;
                }
            }
        },
        watch: {
            tableData: function(n) {
                if (n.length < 30) {
                    this.pageChange.Next.Disable = true
                }
                if (n.length === 30) {
                    this.pageChange.Next.Disable = false
                }
            },
            pageNow: function (n){
                if(n === 1){
                    this.pageChange.Last.Disable = true;
                }
                if(n > 1){
                    this.pageChange.Last.Disable = false;
                }
            },
            provider: function (n) {
                if(n === '360'){
                    this.pageChange.Show = false;
                }
            },
            pageChange: function (n) {
                if(n.Show === true && this.provider === "360"){
                    this.pageChange.Show = false;
                }
            }

        },
        mounted () {
        },
        destroyed () {
        }
    }


</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
    body
        margin 0px
        padding 0px
    .search-input
        margin-outside 100px

    .soft-name
        margin-bottom none
        color black
        font-weight bold

    .soft-feature
        margin-right 20px

    .soft-table-expand
        font-size 0

        label
            width 90px
            color #99a9bf

        .el-form-item
            margin-right 0
            margin-bottom 0
            width 100%

    .soft-rate
        display inline-block
        vertical-align middle

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #d5d5d5;
        border-radius: 5px;
    }
</style>
