$(function() {
	page.init();
})

var page = {
    init: function() {
        page.common();

        page.main();

        page.sidebar();

        page.sub();

        page.style();
    },
    common: function() {


    },
    main: function() {
        if($("#main_slide").length > 0) {
            var slideSpeed = 300;   //에니메이션 속도
            var slideDelay = 4000;  //다음 에니메이션 딜레이
            var mainSlideList = $("#main_slide .slide_list .btn_box");
            var slideIdx = 1;
            setInterval(function() {
                var getIdx = slideIdx;
                mainSlideList.each(function() {
                    $(this).removeClass("no6 no5 no4 no3 no2 no1").addClass("no" + getIdx);
                    getIdx -= 1;
                    if(getIdx < 1) {
                        getIdx = 6;
                    }
                });
                slideIdx += 1;
                if(slideIdx > 6) {
                    slideIdx = 1;
                }
            }, slideDelay);
        }

        //메인 메뉴
        if($("#main_menu").length > 0) {
            var btnMainTab = $("#main_menu .main_tab .btn_tab").on("click", function() {
                btnMainTab.removeClass("active")
                var getIdx = $(this).addClass("active").index();
                $("#main_menu .tab_panel").removeClass("active").eq(getIdx).addClass("active");
                return false;
            });

//            $("#main_menu .slide_top .tab_slide").each(function() {
//                var getSlideBox = $(this).find(".slide_box");
//                if(getSlideBox.length < 6) {
//                    $(this).append(getSlideBox.clone().addClass("slide_mobile"));
//                }
//            });

            var tabSlideArray = [null,null];
            function tabSlideLoad() {
                var getWidth = $(window).width();
                $("#main_menu .slide_top .tab_slide").each(function(key) {
                	if($(this).children(".slide_box").length > 6){
                        if(getWidth > 1160) {
                            if(tabSlideArray[key] == null) {
                                tabSlideArray[key] = $(this).bxSlider({
                                    auto:false,
                                    pause:5000,
                                    speed:300,
                                    pager:false,
                                    minSlides:6,
                                    maxSlides:6,
                                    moveSlides:1,
                                    slideWidth:200
                                });
                            }
                        }
                        else {
                            if(tabSlideArray[key] != null) {
                                tabSlideArray[key].destroySlider();
                                tabSlideArray[key] = null;
                            }
                        }
                	}
                });
            }

            var tabInterval = null;
            $(window).on("resize", function() {
//                clearTimeout(tabInterval);
//                tabInterval = setInterval(function() {
                    tabSlideLoad();
//                }, 1000);
            });
            tabSlideLoad();

            //gnb 스크롤
            var header = $("#header");
            function gnbScroll() {
                var getScrollTop = $(window).scrollTop();
                if(getScrollTop > 100) {
                    header.addClass("fixed");
                }
                else {
                    header.removeClass("fixed");
                }
            }
            $(window).on("scroll touchmove", function() {
                gnbScroll();
            });
            gnbScroll();
        }
    },
    sidebar: function() {
        if($("#sidebar").length == 0) return;

        //스크롤바
        $("#sidebar .sidebar_area").mCustomScrollbar({
            axis:"y",
            theme:"dark",
            autoHideScrollbar:true
        });

        var viewport = $("#viewport");
        var btnSidebar = $("#sidebar .btn_sidebar").on("click", function() {
            viewport.toggleClass("sidebar");
            if(viewport.hasClass("sidebar")) {
                btnSidebar.attr("title","메뉴 열기");
            }
            else {
                btnSidebar.attr("title","메뉴 닫기");
            }
            return false;
        });

        //gnb
        $("#gnb .link").on("click", function() {
			if(viewport.hasClass("sidebar")){
				return false;
			}
            var getMenu = $(this).parent();
            var getSub = getMenu.find(".sub_menu");
            if(getSub.length > 0) {
                if(getMenu.hasClass("active")) {
                    getMenu.removeClass("active");
                    if(viewport.hasClass("sidebar")) {
                        getSub.stop(true,true).hide();
                    }
                    else {
                        getSub.stop(true,true).slideUp(200);
                    }
                }
                else {
                    if(viewport.hasClass("sidebar")) {
                        $("#gnb .menu.active").removeClass("active").find(".sub_menu").stop(true,true).hide();
                        getMenu.addClass("active");
                        getSub.stop(true,true).show();
                    }
                    else {
                        $("#gnb .menu.active").removeClass("active").find(".sub_menu").stop(true,true).slideUp(200);
                        getMenu.addClass("active");
                        getSub.stop(true,true).slideDown(200);
                    }
                }
                return false;
            }
        });

        //전체 메뉴 보기
        $("#sidebar .btn_menuall").on("click", function() {
			if(viewport.hasClass("sidebar")){
				return false;
			}
			
			$(this).toggleClass("active");
			if($(this).hasClass("active")) {
				$(this).find("span").html(("전체 메뉴 닫기"));
				$("#gnb .menu").find(".sub_menu").stop(true,true).slideDown(200).parent().addClass("active");
			}
			else {
				$(this).find("span").html(("전체 메뉴 보기"));
				$("#gnb .menu.active").removeClass("active").find(".sub_menu").stop(true,true).slideUp(200);
			}
            return false;
        });

        //gnb mobile
        $("#header .btn_sidebar").on("click", function() {
            $("body").toggleClass("popup");
            $("#sidebar").toggleClass("active");
            $("#sidebar_mask").fadeToggle(200);
            return false;
        });
        $("#sidebar .btn_close").on("click", function() {
            $("body").removeClass("popup");
            $("#sidebar").removeClass("active");
            $("#sidebar_mask").fadeOut(200);
            return false;
        });
        $("#sidebar_mask").on("click", function(e) {
            if($(e.target).attr("id") == "sidebar_mask") {
                $("body").removeClass("popup");
                $("#sidebar").removeClass("active");
                $("#sidebar_mask").fadeOut(200);
                return false;
            }
        });
    },
    sub: function() {
        //서브페이지 lnb 스크롤바
        $(".menu_scroll").mCustomScrollbar({
            axis:"x",
            theme:"dark",
            autoHideScrollbar:true
        });

        //서브메뉴 모바일 생성
        if($("#lnb_menu").length > 0 && $(".sub_menu_select").length > 0) {
            var mobileSelectMneu = $(".sub_menu_select");
            var selectMenu = $("<select class='select select_url'></select>");
            $("#lnb_menu .lnb_menu .btn_menu").each(function() {
                var getSelect = $(this).hasClass("active") ? "selected='selected'" : "";
                selectMenu.append("<option " + getSelect + " value='" + $(this).attr("href") + "'>" + $(this).text() + "</option>");
            });
            mobileSelectMneu.append(selectMenu);
            mobileSelectMneu.append('<a href="#" class="btn_value">' + selectMenu.find("option:selected").text() + '</a>');
        }

        //소트 메뉴 펼침
        $(".sub_sort_menu .btn_detail").on("click", function() {
            $(this).toggleClass("active");
            $(".sort_panel_detail").stop(true,true).slideToggle(200);
            return false;
        });

        //휴양소 그리드 스크롤
        if($(".sub_grid_detail").length > 0) {
            $(".sub_grid_detail .detail_content").each(function() {
                var getTableClone = $(this).find(".grid_table").clone();
                $(this).find(".grid_table").wrap("<div class='grid_scroll'></div>");
                $(this).prepend($("<div class='grid_header'>").append(getTableClone));
                $(this).find(".grid_scroll").mCustomScrollbar({
                    axis:"y",
                    theme:"dark",
                    autoHideScrollbar:true
                });
            });
        }

        //휴양소 그리드 수정 체크박스
        $(".check_table_box").each(function() {
            var getGridTable = $(this);
            var getGridCheckAll = $(this).find(".check_all").on("change", function() {
            	if(getGridTable.find("tbody .check").prop("disabled") == false){
            		getGridTable.find("tbody .check").prop("checked", this.checked);
            	}
            });
            var getGridCheck = $(this).find(".check:not(.check_all)").on("change", function() {
                getGridCheckAll.prop("checked", getGridTable.find("tbody .check:not(:checked)").length == 0);
            });

            $(this).find(".input_modify").on("focusin", function(e) {
                var getGridTr = $(this).closest("tr");
                getGridTr.removeClass("readonly");
                // getGridTr.find(".input_text").prop("readonly", false);
                // getGridTr.find(".select").prop("disabled", false);
            }).on("focusout", function() {
                var getGridTr = $(this).closest("tr");
                getGridTr.addClass("readonly");
                // getGridTr.find(".input_text").prop("readonly", true);
                // getGridTr.find(".select").prop("disabled", true);
            });
        });

        $(".btn_check_all").on("click", function(){
        	$("[id^=chk]").prop("checked", true);
        });
        $(".btn_uncheck_all").on("click", function(){
        	$("[id^=chk]").prop("checked", false);
        });

        $(".req_list").each(function() {
            var getGridTable = $(this);
            var getGridCheckAll = $(this).find(".check_all").on("change", function() {

                if($(".chk_bx_all").prop("checked")) {
                	getGridTable.find(".check").prop("checked", this.checked);
            	}
            	else
            	{
            		getGridTable.find(".check").prop("checked", this.checked);
            	}
            });



        });


        //휴양소 모바일 스탭
        if($(".sub_grid_detail").length > 0) {
            var stepIdx = 0;
            var stepPageBtn = $(".sub_page_btn");
            var stepDetailPanel = $(".detail_panel");
            var stepList = $(".step_list .step");
            $(".sub_page_btn .btn_detail_prev").on("click", function() {
                if(stepIdx > 0) {
                    stepIdx -= 1;
                    stepPageBtn.removeClass("step_0 step_1 step_2 step_3").addClass("step_" + stepIdx);
                    stepList.removeClass("active").eq(stepIdx).addClass("active");
                    stepDetailPanel.removeClass("active").eq(stepIdx).addClass("active");
                    setTimeout(function() {
                        gridDetailResize();
                    }, 10);
                }
                return false;
            });
            $(".sub_page_btn .btn_detail_next").on("click", function() {
                if(stepIdx < 3) {
                    stepIdx += 1;
                    stepPageBtn.removeClass("step_0 step_1 step_2 step_3").addClass("step_" + stepIdx);
                    stepList.removeClass("active").eq(stepIdx).addClass("active");
                    stepDetailPanel.removeClass("active").eq(stepIdx).addClass("active");
                    setTimeout(function() {
                        gridDetailResize();
                    }, 10);
                }
                return false;
            });
            $(".sub_page_btn .btn_detail_complete").on("click", function() {
                alert("완료 실행");
                return false;
            });

            //휴양소 리스트 높이 설정
            var content = $("#content").addClass("full_height");
            var gridDetailBox = $(".sub_grid_detail");
            var gridInterval = null;
            var gridResizeCheck = true;
            function gridDetailResize() {
                if(gridResizeCheck == false) return;
                var getHeight = $(window).height();
                // content.height(getHeight);
                gridDetailBox.each(function() {
                    var getTop = $(this).offset().top;

                    //반응형일때 높이값이 상이 하여 수정함. LDW
                    //$(this).height((getHeight - 90) - getTop);
                    $(this).height("100%");
                });
            }

            $(".sub_grid_detail .detail_content input, .sub_grid_detail .detail_content select, .sub_grid_detail .detail_content textarea").on("focusin", function() {
                gridResizeCheck = false;
            }).on("focusout", function() {
                gridResizeCheck = true;
            });

            $(window).on("resize", function() {
                clearTimeout(gridInterval);
                gridInterval = setTimeout(function() {
                    gridDetailResize();
                }, 100);
            });
            gridDetailResize();
        }

    },
    style: function() {
        $(".select_box .btn_value").off("click").on("click", function() {
            $(this).parent().toggleClass("active").find(".select_list").stop(true,true).fadeToggle(200);
            return false;
        });
        $(".select").off("change").on("change", function() {
            $(this).parent().parent().find(".btn_value").html($(this).find("option:selected").text());
            if($(this).hasClass("select_url") && this.value != "") {
                location.href = this.value;
            }
        }).each(function() {
            $(this).parent().parent().find(".btn_value").html($(this).find("option:selected").text());
        });
    }
}
