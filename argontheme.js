/*根据滚动高度改变顶栏透明度*/
!function(){
	let $toolbar = $("#navbar-main");
	let $bannerContainer = $("#banner_container");
	let $content = $("#content");

	let startTransitionHeight;
	let endTransitionHeight;

	function changeToolbarTransparency(){
		//let toolbarRgb = "94, 114, 228";
		let toolbarRgb = $("meta[name='theme-color-rgb']").attr("content");
		if ($("html").hasClass("darkmode")){
			toolbarRgb = "33, 33, 33";
		}
		let scrollTop = $(window).scrollTop();
		startTransitionHeight = $bannerContainer.offset().top - 75;
		endTransitionHeight = $content.offset().top - 75;
		if ($(window).scrollTop() < startTransitionHeight){
			$toolbar.css("cssText","background-color: rgba(" + toolbarRgb + ", 0) !important;");
			$toolbar.css("box-shadow","none");
			$toolbar.addClass("navbar-ontop");
			return;
		}
		if ($(window).scrollTop() > endTransitionHeight){
			$toolbar.css("cssText","background-color: rgba(" + toolbarRgb + ", 0.85) !important;");
			$toolbar.css("box-shadow","");
			$toolbar.removeClass("navbar-ontop");
			return;
		}
		let transparency = (scrollTop - startTransitionHeight) / (endTransitionHeight - startTransitionHeight) * 0.85;
		$toolbar.css("cssText","background-color: rgba(" + toolbarRgb + ", " + transparency + ") !important;");
		$toolbar.css("box-shadow","");
		$toolbar.removeClass("navbar-ontop");
	}
	changeToolbarTransparency();
	$(window).scroll(function(){
		changeToolbarTransparency();
	});
}();


/*左侧栏随页面滚动浮动*/
!function(){
	let $leftbarPart1 = $('#leftbar_part1');
	let $leftbarPart2 = $('#leftbar_part2');
	function changeLeftbarStickyStatus(){
		if( $('#leftbar_part1').offset().top + $('#leftbar_part1').outerHeight() + 10 - $(window).scrollTop() <= 90 ){
			//滚动条在页面中间浮动状态
			$leftbarPart2.addClass('sticky');
		}else{
			//滚动条在顶部 不浮动状态
			$leftbarPart2.removeClass('sticky');
		}
	}
	changeLeftbarStickyStatus();
	$(window).scroll(function(){
		changeLeftbarStickyStatus();
	});
	$(window).resize(function(){
		changeLeftbarStickyStatus();
	});
}();


/*浮动按钮栏相关 (回顶等)*/
!function(){
	let $fabs = $('#float_action_buttons');
	let $backToTopBtn = $('#fab_back_to_top');
	let $toggleSidesBtn = $('#fab_toggle_sides');
	let $toggleDarkmode = $('#fab_toggle_darkmode');
	let $toggleBlogSettings = $('#fab_toggle_blog_settings_popup');

	let $readingProgressBar = $('#fab_reading_progress_bar');
	let $readingProgressDetails = $('#fab_reading_progress_details');

	let isScrolling = false;
	$backToTopBtn.on("click" , function(){
		if (!isScrolling){
			isScrolling = true;
			setTimeout(function(){
				isScrolling = false;
			} , 600);
			$("body,html").animate({
				scrollTop: 0
			}, 600);
		}
	});

	function toggleDarkmode(){
		$("html").toggleClass("darkmode");
		if ($("html").hasClass("darkmode")){
			$('#fab_toggle_darkmode .btn-inner--icon').html("<i class='fa fa-lightbulb-o'></i>");
			$("#blog_setting_darkmode_switch")[0].checked = true;
			setCookie("argon_enable_dark_mode", "true", 365*24*60*60);
		}else{
			$('#fab_toggle_darkmode .btn-inner--icon').html("<i class='fa fa-moon-o'></i>");
			$("#blog_setting_darkmode_switch")[0].checked = false;
			setCookie("argon_enable_dark_mode", "false", 365*24*60*60);
		}
		$(window).trigger("scroll");
	}
	$toggleDarkmode.on("click" , function(){
		toggleDarkmode();
	});
	
	if (localStorage['Argon_Fabs_Floating_Status'] == "left"){
		$fabs.addClass("fabs-float-left");
	}
	$toggleSidesBtn.on("click" , function(){
		$fabs.addClass("fabs-unloaded");
		setTimeout(function(){
			$fabs.toggleClass("fabs-float-left");
			if ($fabs.hasClass("fabs-float-left")){
				localStorage['Argon_Fabs_Floating_Status'] = "left";
			}else{
				localStorage['Argon_Fabs_Floating_Status'] = "right";
			}
			$fabs.removeClass("fabs-unloaded");
		} , 300);
	});
	//博客设置
	$toggleBlogSettings.on("click" , function(){
		$("#float_action_buttons").toggleClass("blog_settings_opened");
	});
	$("#close_blog_settings").on("click" , function(){
		$("#float_action_buttons").removeClass("blog_settings_opened");
	});
	$("#blog_setting_darkmode_switch").on("change" , function(){
		toggleDarkmode();
	});
	//字体
	$("#blog_setting_font_sans_serif").on("click" , function(){
		$("html").removeClass("use-serif");
		localStorage['Argon_Use_Serif'] = "false";
	});
	$("#blog_setting_font_serif").on("click" , function(){
		$("html").addClass("use-serif");
		localStorage['Argon_Use_Serif'] = "true";
	});
	if (localStorage['Argon_Use_Serif'] == "true"){
		$("html").addClass("use-serif");
	}else{
		$("html").removeClass("use-serif");
	}
	//阴影
	$("#blog_setting_shadow_small").on("click" , function(){
		$("html").removeClass("use-big-shadow");
		localStorage['Argon_Use_Big_Shadow'] = "false";
	});
	$("#blog_setting_shadow_big").on("click" , function(){
		$("html").addClass("use-big-shadow");
		localStorage['Argon_Use_Big_Shadow'] = "true";
	});
	if (localStorage['Argon_Use_Big_Shadow'] == "true"){
		$("html").addClass("use-big-shadow");
	}else{
		$("html").removeClass("use-big-shadow");
	}
	//滤镜
	function setBlogFilter(name){
		if (name == undefined || name == ""){
			name = "off";
		}
		if (!$("html").hasClass("filter-" + name)){
			$("html").removeClass("filter-sunset filter-darkness filter-grayscale");
			if (name != "off"){
				$("html").addClass("filter-" + name);
			}
		}
		$("#blog_setting_filters .blog-setting-filter-btn").removeClass("active");
		$("#blog_setting_filters .blog-setting-filter-btn[filter-name='" + name + "']").addClass("active");
		localStorage['Argon_Filter'] = name;
	}
	setBlogFilter(localStorage['Argon_Filter']);
	$(".blog-setting-filter-btn").on("click" , function(){
		setBlogFilter(this.getAttribute("filter-name"));
	});

	function changeFabDisplayStatus(){
		//阅读进度
		let readingProgress = $(window).scrollTop() / Math.max($(document).height() - $(window).height(), 0.01);
		$readingProgressDetails.html((readingProgress * 100).toFixed(0) + "%");
		$readingProgressBar.css("width" , (readingProgress * 100).toFixed(0) + "%");
		//是否显示回顶
		if ($(window).scrollTop() >= 400 || readingProgress >= 0.5){
			$backToTopBtn.removeClass("fab-hidden");
		}else{
			$backToTopBtn.addClass("fab-hidden");
		}
	}
	changeFabDisplayStatus();
	$(window).scroll(function(){
		changeFabDisplayStatus();
	});
	$fabs.removeClass("fabs-unloaded");
}();

/*评论区 & 发送评论*/
!function(){
	//回复评论
	replying = false , replyID = 0;
	function reply(commentID){
		replying = true;
		replyID = commentID;
		$("#post_comment_reply_name").html($("#comment-" + commentID + " .comment-item-title")[0].innerHTML);
		$("#post_comment_reply_preview").html($("#comment-" + commentID + " .comment-item-text")[0].innerHTML);
		$("body,html").animate({
			scrollTop: $('#post_comment').offset().top - 100
		}, 300);
		$('#post_comment_reply_info').slideDown(600);
	}
	function cencelReply(){
		replying = false;
		replyID = 0;
		$('#post_comment_reply_info').slideUp(300);
	}
	$(document).on("click" , ".comment-reply" , function(){
		reply(this.getAttribute("data-id"));
	});
	$(document).on("click" , "#post_comment_reply_cencel" , function(){
		cencelReply();
	});

	//显示/隐藏额外输入框 (评论者网站)
	$(document).on("click" , "#post_comment_toggle_extra_input" , function(){
		$("#post_comment").toggleClass("show-extra-input");
		if ($("#post_comment").hasClass("show-extra-input")){
			$("#post_comment_extra_input").slideDown(300);
		}else{
			$("#post_comment_extra_input").slideUp(300);
		}
	});

	//输入框细节
	$(document).on("change input keydown keyup propertychange" , "#post_comment_content" , function(){
		$("#post_comment_content_hidden")[0].innerText = $("#post_comment_content").val() + "\n";
		$("#post_comment_content").css("height" , $("#post_comment_content_hidden").outerHeight());
	});
	$(document).on("focus" , "#post_comment_link" , function(){
		$(".post-comment-link-container").addClass("active");
	});
	$(document).on("blur" , "#post_comment_link" , function(){
		$(".post-comment-link-container").removeClass("active");
	});
	$(document).on("focus" , "#post_comment_captcha" , function(){
		$(".post-comment-captcha-container").addClass("active");
	});
	$(document).on("blur" , "#post_comment_captcha" , function(){
		$(".post-comment-captcha-container").removeClass("active");
	});

	//发送评论
	$(document).on("click" , "#post_comment_send" , function(){
		commentContent = $("#post_comment_content").val();
		commentName = $("#post_comment_name").val();
		commentEmail = $("#post_comment_email").val();
		commentLink = $("#post_comment_link").val();
		commentCaptcha = $("#post_comment_captcha").val();
		useMarkdown = $("#comment_post_use_markdown")[0].checked;

		postID = $("#post_comment_post_id").val();
		commentCaptchaSeed = $("#post_comment_captcha_seed").val();

		isError = false;
		errorMsg = "";

		//检查表单合法性
		if (commentContent.match(/^\s*$/)){
			isError = true;
			errorMsg += "评论内容不能为空</br>";
		}
		if (commentName.match(/^\s*$/)){
			isError = true;
			errorMsg += "昵称不能为空</br>";
		}
		if (!(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(commentEmail)){
			isError = true;
			errorMsg += "邮箱格式错误</br>";
		}
		if (commentLink != "" && !(/https?:\/\//).test(commentLink)){
			isError = true;
			errorMsg += "网站格式错误 (不是 http(s):// 开头)</br>";
		}
		if (commentCaptcha == ""){
			isError = true;
			errorMsg += "验证码未输入";
		}
		if (commentCaptcha != "" && !(/^[0-9]+$/).test(commentCaptcha)){
			isError = true;
			errorMsg += "验证码格式错误";
		}
		if (isError){
			iziToast.show({
				title: '评论格式错误',
				message: errorMsg,
				class: 'shadow-sm',
				position: 'topRight',
				backgroundColor: '#f5365c',
				titleColor: '#ffffff',
				messageColor: '#ffffff',
				iconColor: '#ffffff',
				progressBarColor: '#ffffff',
				icon: 'fa fa-close',
				timeout: 5000
			});
			return;
		}

		//增加 disabled 属性和其他的表单提示
		$("#post_comment_content").attr("disabled","disabled");
		$("#post_comment_name").attr("disabled","disabled");
		$("#post_comment_email").attr("disabled","disabled");
		$("#post_comment_captcha").attr("disabled","disabled");
		$("#post_comment_link").attr("disabled","disabled");
		$("#post_comment_send").attr("disabled","disabled");
		$("#post_comment_reply_cencel").attr("disabled","disabled");
		$("#post_comment_send .btn-inner--icon").html("<i class='fa fa-spinner fa-spin'></i>");
		$("#post_comment_send .btn-inner--text").html("发送中");


		iziToast.show({
			title: '正在发送',
			message: "评论正在发送中...",
			class: 'shadow-sm',
			position: 'topRight',
			backgroundColor: '#5e72e4',
			titleColor: '#ffffff',
			messageColor: '#ffffff',
			iconColor: '#ffffff',
			progressBarColor: '#ffffff',
			icon: 'fa fa-spinner fa-spin',
			close: false,
			timeout: 999999999
		});

		$.ajax({
			type: 'POST',
			url: "/wp-comments-post.php",
			data: {
				comment: commentContent,
				author: encodeURI(commentName),
				email: encodeURI(commentEmail),
				url: encodeURI(commentLink),
				comment_post_ID: postID,
				comment_parent: replyID,
				comment_captcha_seed: commentCaptchaSeed,
				comment_captcha: commentCaptcha,
				use_markdown: useMarkdown,
			},
			success: function(result){
				$("#post_comment_content").removeAttr("disabled");
				$("#post_comment_name").removeAttr("disabled");
				$("#post_comment_email").removeAttr("disabled");
				$("#post_comment_captcha").removeAttr("disabled");
				$("#post_comment_link").removeAttr("disabled");
				$("#post_comment_send").removeAttr("disabled");
				$("#post_comment_reply_cencel").removeAttr("disabled");
				$("#post_comment_send .btn-inner--icon").html("<i class='fa fa-send'></i>");
				$("#post_comment_send .btn-inner--text").html("发送");
				let vdom = document.createElement('html');
				vdom.innerHTML = result;
				let $vdom = $('<div></div>');
				$vdom.html(result);

				//判断是否有错误
				if (vdom.getElementsByTagName('body')[0].getAttribute("id") == "error-page"){
					$vbody = $('<div></div>');
					$vbody.html("<div id='body'>" + vdom.getElementsByTagName('body')[0].innerHTML + "</div>");
					$("a" , $vbody).remove();
					iziToast.destroy();
					iziToast.show({
						title: '评论发送失败',
						message: $.trim($("#body" , $vbody)[0].innerText),
						class: 'shadow-sm',
						position: 'topRight',
						backgroundColor: '#f5365c',
						titleColor: '#ffffff',
						messageColor: '#ffffff',
						iconColor: '#ffffff',
						progressBarColor: '#ffffff',
						icon: 'fa fa-close',
						timeout: 5000
					});
					return;
				}

				//发送成功，替换评论区
				iziToast.destroy();
				iziToast.show({
					title: '发送成功',
					message: "您的评论已发送",
					class: 'shadow-sm',
					position: 'topRight',
					backgroundColor: '#2dce89',
					titleColor: '#ffffff',
					messageColor: '#ffffff',
					iconColor: '#ffffff',
					progressBarColor: '#ffffff',
					icon: 'fa fa-check',
					timeout: 5000
				});
				replying = false;
				replyID = 0;
				$("#comments").html($("#comments" , $vdom)[0].innerHTML);
				$("#post_comment").html($("#post_comment" , $vdom)[0].innerHTML);
			},
			error: function(result){
				$("#post_comment_content").removeAttr("disabled");
				$("#post_comment_name").removeAttr("disabled");
				$("#post_comment_email").removeAttr("disabled");
				$("#post_comment_captcha").removeAttr("disabled");
				$("#post_comment_link").removeAttr("disabled");
				$("#post_comment_send").removeAttr("disabled");
				$("#post_comment_reply_cencel").removeAttr("disabled");
				$("#post_comment_send .btn-inner--icon").html("<i class='fa fa-send'></i>");
				$("#post_comment_send .btn-inner--text").html("发送");
				if (result.readyState != 4 || result.status == 0){
					iziToast.destroy();
					iziToast.show({
						title: '评论发送失败',
						message: "未知原因",
						class: 'shadow-sm',
						position: 'topRight',
						backgroundColor: '#f5365c',
						titleColor: '#ffffff',
						messageColor: '#ffffff',
						iconColor: '#ffffff',
						progressBarColor: '#ffffff',
						icon: 'fa fa-close',
						timeout: 5000
					});
					return;
				}
				let vdom = document.createElement('html');
				vdom.innerHTML = result.responseText;
				let $vdom = $('<div></div>');
				$vdom.html(result.responseText);
				if (vdom.getElementsByTagName('body')[0].getAttribute("id") == "error-page"){
					$vbody = $('<div></div>');
					$vbody.html("<div id='body'>" + vdom.getElementsByTagName('body')[0].innerHTML + "</div>");
					$("a" , $vbody).remove();
					iziToast.destroy();
					iziToast.show({
						title: '评论发送失败',
						message: $.trim($("#body" , $vbody)[0].innerText),
						class: 'shadow-sm',
						position: 'topRight',
						backgroundColor: '#f5365c',
						titleColor: '#ffffff',
						messageColor: '#ffffff',
						iconColor: '#ffffff',
						progressBarColor: '#ffffff',
						icon: 'fa fa-close',
						timeout: 5000
					});
					return;
				}else{
					iziToast.destroy();
					iziToast.show({
						title: '评论发送失败',
						message: "未知原因",
						class: 'shadow-sm',
						position: 'topRight',
						backgroundColor: '#f5365c',
						titleColor: '#ffffff',
						messageColor: '#ffffff',
						iconColor: '#ffffff',
						progressBarColor: '#ffffff',
						icon: 'fa fa-close',
						timeout: 5000
					});
					return;
				}
			}
		});
	});
}();

/*URL 中 # 根据 ID 定位*/
!function(){
	$(window).on("hashchange" , function(){
		hash = window.location.hash;
		if (hash.length == 0){
			return;
		}
		if ($(hash).length == 0){
			return;
		}
		$("body,html").animate({
			scrollTop: $(hash).offset().top + 100
		}, 200);
	});
	$(window).trigger("hashchange");
}();

/*Pjax*/
var pjaxUrlChanged , pjaxLoading = false;
function pjaxLoadUrl(url , pushstate){
	if (pjaxLoading == false){
		NProgress.remove();
		NProgress.start();
		pjaxLoading = true;
		pjaxUrlChanged = false;
		try{
			if (pushstate == true){
				if (url.match(/https?:\/\//) != null){
					if (window.location.href.match(/.*\:\/\/([^\/]*).*/)[1] != url.match(/.*\:\/\/([^\/]*).*/)[1]){
						throw "Cross Domain";
					}
					if (window.location.href.match(/https?:\/\//)[0] != url.match(/https?:\/\//)[0]){
						throw "Different Protocols";
					}
				}
			}
			NProgress.set(0.618);
			$.ajax({
				url : url,
				type : "GET",
				dataType : "html",
				success : function(result){
					NProgress.inc();
					try{
						let vdom = document.createElement('html');
						vdom.innerHTML = result;
						let $vdom = $('<div></div>');
						$vdom.html(result);

						if ($("#using_pjax" , $vdom).length == 0){
							throw "HTML struct not simular";
						}
						document.body.setAttribute("class" , vdom.getElementsByTagName('body')[0].getAttribute("class"));
						$("#leftbar_part2_inner").html($("#leftbar_part2_inner" , $vdom)[0].innerHTML);
						$("#primary").html($("#primary" , $vdom)[0].innerHTML);
						$("#leftbar_part1_menu").html($("#leftbar_part1_menu" , $vdom)[0].innerHTML);
						$("#wpadminbar").html($("#wpadminbar" , $vdom).html());

						$("#content .page-infomation-card").remove();
						if ($(".page-infomation-card" , $vdom).length > 0){
							$("#content").prepend($(".page-infomation-card" , $vdom)[0].outerHTML);
						}

						
						$("body,html").animate({
							scrollTop: 0
						}, 600);
						
						NProgress.inc();

						if (pushstate == true){
							window.history.pushState({} , '' , url);
						}
						pjaxLoading = false;
						pjaxUrlChanged = true;
						
						$("title").html($("title" , $vdom)[0].innerHTML);

						try{
							if (MathJax != undefined){
								MathJax.typeset();
							}
						}catch (err){}

						getGithubInfoCardContent();
						
						let scripts = $("#content script:not([no-pjax]):not(.no-pjax)" , $vdom);
						for (let script of scripts){
							if (script.innerHTML.indexOf("\/*NO-PJAX*\/") == -1){
								try{
									eval(script.innerHTML);
								}catch (err){}
							}
						}

						NProgress.done();

						$(window).trigger("hashchange");
						$(window).trigger("scroll");

						if (typeof(window.pjaxLoaded) == "function"){
							window.pjaxLoaded();
						}
					}catch (err){
						console.log(err);
						NProgress.done();
						if (pjaxUrlChanged){
							pjaxLoading = false;
							window.location.reload();
						}else{
							pjaxUrlChanged = true;
							pjaxLoading = false;
							window.location.href = url;
						}
					}
				},
				error : function(){
					NProgress.done();
					pjaxLoading = false;
					pjaxUrlChanged = true;
					window.location.href = url;
				}
			});
		}catch(err){
			console.log(err);
			NProgress.done();
			pjaxLoading = false;
			pjaxUrlChanged = true;
			window.location.href = url;
		}
	}
}
$(document).ready(function(){
	$(document).on("click" , "a[href]:not([no-pjax]):not(.no-pjax):not([href^='#']):not([target='_blank'])" , function(){
		if (pjaxLoading){
			return false;
		}
		//对文章预览卡片使用过渡动画
		if ($(this).is("#main article.post-preview a.post-title")){
			let $card = $($(this).parents("article.post-preview")[0]);
			$card.append("<div class='loading-css-animation'><div class='loading-dot loading-dot-1' ></div><div class='loading-dot loading-dot-2' ></div><div class='loading-dot loading-dot-3' ></div><div class='loading-dot loading-dot-4' ></div><div class='loading-dot loading-dot-5' ></div><div class='loading-dot loading-dot-6' ></div><div class='loading-dot loading-dot-7' ></div><div class='loading-dot loading-dot-8' ></div></div></div>");
			$card.addClass("post-pjax-loading");
			$("#main").addClass("post-list-pjax-loading");
			let offsetTop = $($card).offset().top - $("#main").offset().top;
			$card.css("transform" , "translateY(-" + offsetTop + "px)");
			$("body,html").animate({
				scrollTop: 0
			}, 450);
		}
		//Pjax 加载
		let url = this.getAttribute("href");
		pjaxLoadUrl(url , true);
		return false;
	});
	$(window).on("popstate" , function(){
		try{
			$("article img.zoomify.zoomed").zoomify('zoomOut');
		}catch(err){}
		setTimeout(function(){
			pjaxLoadUrl(document.location , false);
		},1);
		return false;
	});
});

/*Tags Dialog pjax 加载后自动关闭*/
$(document).on("click" , "#blog_tags .tag" , function(){
	$("#blog_tags button.close").trigger("click");
});
$(document).on("click" , "#blog_categories .tag" , function(){
	$("#blog_categories button.close").trigger("click");
});

/*侧栏手机适配*/
!function(){
	$(document).on("click" , "#fab_open_sidebar" , function(){
		$("html").addClass("leftbar-opened");
	});
	$(document).on("click" , "#sidebar_mask" , function(){
		$("html").removeClass("leftbar-opened");
	});
	$(document).on("click" , "#leftbar a[href]:not([no-pjax]):not([href^='#'])" , function(){
		$("html").removeClass("leftbar-opened");
	});
}();

/*折叠区块小工具*/
$(document).on("click" , ".collapse-block .collapse-block-title" , function(){
	let id = this.getAttribute("collapse-id");
	let selecter = ".collapse-block[collapse-id='" + id +"']";
	$(selecter).toggleClass("collapsed");
	if ($(selecter).hasClass("collapsed")){
		$(selecter + " .collapse-block-body").stop(true , false).slideUp(200);
	}else{
		$(selecter + " .collapse-block-body").stop(true , false).slideDown(200);
	}
});

/*获得 Github Repo Shortcode 信息卡内容*/
function getGithubInfoCardContent(){
	$(".github-info-card").each(function(){
		(function($this){
			author = $this.attr("data-author");
			project = $this.attr("data-project");
			$.ajax({
				url : "https://api.github.com/repos/" + author + "/" + project,
				type : "GET",
				dataType : "json",
				success : function(result){
					description = result.description;
					if (result.homepage != ""){
						description += " <a href='" + result.homepage + "' target='_blank' no-pjax>" + result.homepage + "</a>"
					}
					$(".github-info-card-description" , $this).html(description);
					$(".github-info-card-stars" , $this).html(result.stargazers_count);
					$(".github-info-card-forks" , $this).html(result.forks_count);
					console.log(result);
				},
				error : function(xhr){
					if (xhr.status == 404){
						$(".github-info-card-description" , $this).html("找不到该 Repo");
					}else{
						$(".github-info-card-description" , $this).html("获取 Repo 信息失败");
					}
				}
			});
		})($(this));
	});
}
getGithubInfoCardContent();

/*说说点赞*/
$(document).on("click" , ".shuoshuo-upvote" , function(){
	$this = $(this);
	ID = $this.attr("data-id");
	$this.addClass("shuoshuo-upvoting");
	$.ajax({
		url : "/wp-admin/admin-ajax.php",
		type : "POST",
		dataType : "json",
		data : {
			action: "upvote_shuoshuo",
			shuoshuo_id : ID,
		},
		success : function(result){
			$this.removeClass("shuoshuo-upvoting");
			if (result.status == "success"){
				$(".shuoshuo-upvote-num" , $this).html(result.total_upvote);
				$("i.fa-thumbs-o-up" , $this).addClass("fa-thumbs-up").removeClass("fa-thumbs-o-up");
				$this.addClass("upvoted");
				$this.addClass("shuoshuo-upvoted-animation");
				iziToast.show({
					title: result.msg,
					class: 'shadow-sm',
					position: 'topRight',
					backgroundColor: '#2dce89',
					titleColor: '#ffffff',
					messageColor: '#ffffff',
					iconColor: '#ffffff',
					progressBarColor: '#ffffff',
					icon: 'fa fa-check',
					timeout: 5000
				});
			}else{
				$(".shuoshuo-upvote-num" , $this).html(result.total_upvote);
				iziToast.show({
					title: result.msg,
					class: 'shadow-sm',
					position: 'topRight',
					backgroundColor: '#f5365c',
					titleColor: '#ffffff',
					messageColor: '#ffffff',
					iconColor: '#ffffff',
					progressBarColor: '#ffffff',
					icon: 'fa fa-close',
					timeout: 5000
				});
			}
		},
		error : function(xhr){
			$this.removeClass("shuoshuo-upvoting");
			iziToast.show({
				title: "点赞失败",
				class: 'shadow-sm',
				position: 'topRight',
				backgroundColor: '#f5365c',
				titleColor: '#ffffff',
				messageColor: '#ffffff',
				iconColor: '#ffffff',
				progressBarColor: '#ffffff',
				icon: 'fa fa-close',
				timeout: 5000
			});
		}
	});
});

//Cookies 操作
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
//颜色计算
function rgb2hsl(R,G,B){
	let r = R / 255;
	let g = G / 255;
	let b = B / 255;

	let var_Min = Math.min(r, g, b);
	let var_Max = Math.max(r, g, b);
	let del_Max = var_Max - var_Min;

	let H, S, L = (var_Max + var_Min) / 2;

	if (del_Max == 0){
		H = 0;
		S = 0;
	}else{
		if (L < 0.5){
			S = del_Max / (var_Max + var_Min);
		}else{
			S = del_Max / (2 - var_Max - var_Min);
		}

		del_R = (((var_Max - r) / 6) + (del_Max / 2)) / del_Max;
		del_G = (((var_Max - g) / 6) + (del_Max / 2)) / del_Max;
		del_B = (((var_Max - b) / 6) + (del_Max / 2)) / del_Max;

		if (r == var_Max){
			H = del_B - del_G;
		}
		else if (g == var_Max){
			H = (1 / 3) + del_R - del_B;
		}
		else if (b == var_Max){
			H = (2 / 3) + del_G - del_R;
		}
		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}
	return {
		'h': H,//0~1
		's': S,
		'l': L
	};
}
function Hue_2_RGB(v1,v2,vH){
	if (vH < 0) vH += 1;
	if (vH > 1) vH -= 1;
	if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH);
	if ((2 * vH) < 1) return v2;
	if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
	return v1;
}
function hsl2rgb(h,s,l){
	let r, g, b, var_1, var_2;
	if (s == 0){
		r = l;
		g = l;
		b = l;
	}
	else{
		if (l < 0.5){
			var_2 = l * (1 + s);
		}
		else{
			var_2 = (l + s) - (s * l);
		}
		var_1 = 2 * l - var_2;
		r = Hue_2_RGB(var_1, var_2, h + (1 / 3));
		g = Hue_2_RGB(var_1, var_2, h);
		b = Hue_2_RGB(var_1, var_2, h - (1 / 3));
	}
	return {
		'R': Math.round(r * 255),//0~255
		'G': Math.round(g * 255),
		'B': Math.round(b * 255),
		'r': r,//0~1
		'g': g,
		'b': b
	};
}
function rgb2hex(r,g,b){
	let hex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');
	let rh, gh, bh;
	rh = "", gh ="", bh="";
	while (rh.length < 2){
		rh = hex[r%16] + rh;
		r = Math.floor(r / 16);
	}
	while (gh.length < 2){
		gh = hex[g%16] + gh;
		g = Math.floor(g / 16);
	}
	while (bh.length < 2){
		bh = hex[b%16] + bh;
		b = Math.floor(b / 16);
	}
	return "#" + rh + gh + bh;
}
function hex2rgb(hex){
	//hex: #XXXXXX
	let dec = {
		'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
	};
	return {
		'R': (dec[hex.substr(1,1)] * 16 + dec[hex.substr(2,1)]),//0~255
		'G': (dec[hex.substr(3,1)] * 16 + dec[hex.substr(4,1)]),
		'B': (dec[hex.substr(5,1)] * 16 + dec[hex.substr(6,1)]),
		'r': (dec[hex.substr(1,1)] * 16 + dec[hex.substr(2,1)]) / 255,//0~1
		'g': (dec[hex.substr(3,1)] * 16 + dec[hex.substr(4,1)]) / 255,
		'b': (dec[hex.substr(5,1)] * 16 + dec[hex.substr(6,1)]) / 255
	};
}
function rgb2str(rgb){
	return rgb['R'] + "," + rgb['G'] + "," + rgb['B'];
}
function hex2str(hex){
	return rgb2str(hex2rgb(hex));
}
//颜色选择器 & 切换主题色
if ($("meta[name='argon-enable-custom-theme-color']").attr("content") == 'true'){
	let themeColorPicker = new Pickr({
		el: '#theme-color-picker',
		container: 'body',
		theme: 'monolith',
		closeOnScroll: false,
		appClass: 'theme-color-picker-box',
		useAsButton: false,
		padding: 8,
		inline: false,
		autoReposition: true,
		sliders: 'h',
		disabled: false,
		lockOpacity: true,
		outputPrecision: 0,
		comparison: false,
		default: $("meta[name='theme-color']").attr("content"),
		swatches: ['#5e72e4', '#fa7298', '#009688', '#607d8b', '#2196f3', '#3f51b5', '#ff9700', '#109d58', '#dc4437', '#673bb7', '#212121', '#795547'],
		defaultRepresentation: 'HEX',
		showAlways: false,
	    closeWithKey: 'Escape',
	    position: 'top-start',
	    adjustableNumbers: false,
	    components: {
	        palette: true,
			preview: true,
			opacity: false,
			hue: true,
			interaction: {
				hex: true,
				rgba: true,
				hsla: false,
				hsva: false,
				cmyk: false,
				input: true,
				clear: false,
				cancel: true,
				save: true
			}
		},
		strings: {
			save: '确定',
			clear: '清除',
			cancel: '恢复博客默认'
		}
	});
	themeColorPicker.on('change', instance => {
		updateThemeColor(pickrObjectToHEX(instance), true);
	})
	themeColorPicker.on('save', (color, instance) => {
		updateThemeColor(pickrObjectToHEX(instance._color), true);
		themeColorPicker.hide();
	})
	themeColorPicker.on('cancel', instance => {
		themeColorPicker.hide();
		themeColorPicker.setColor($("meta[name='theme-color-origin']").attr("content").toUpperCase());
		updateThemeColor($("meta[name='theme-color-origin']").attr("content").toUpperCase(), false);
		setCookie("argon_custom_theme_color", "", 0);
	});
}
function pickrObjectToHEX(color){
	let HEXA = color.toHEXA();
	return ("#" + HEXA[0] + HEXA[1] + HEXA[2]).toUpperCase();
}
function updateThemeColor(color, setcookie){
	let themecolor = color;
	let themecolor_rgbstr = hex2str(themecolor);
	let RGB = hex2rgb(themecolor);
	let HSL = rgb2hsl(RGB['R'], RGB['G'], RGB['B']);

	let RGB_dark0 = hsl2rgb(HSL['h'], HSL['s'], Math.max(HSL['l'] - 0.025, 0));
	let themecolor_dark0 = rgb2hex(RGB_dark0['R'],RGB_dark0['G'],RGB_dark0['B']);

	let RGB_dark = hsl2rgb(HSL['h'], HSL['s'], Math.max(HSL['l'] - 0.05, 0));
	let themecolor_dark = rgb2hex(RGB_dark['R'], RGB_dark['G'], RGB_dark['B']);

	let RGB_dark2 = hsl2rgb(HSL['h'], HSL['s'], Math.max(HSL['l'] - 0.1, 0));
	let themecolor_dark2 = rgb2hex(RGB_dark2['R'],RGB_dark2['G'],RGB_dark2['B']);

	let RGB_dark3 = hsl2rgb(HSL['h'], HSL['s'], Math.max(HSL['l'] - 0.15, 0));
	let themecolor_dark3 = rgb2hex(RGB_dark3['R'],RGB_dark3['G'],RGB_dark3['B']);

	let RGB_light = hsl2rgb(HSL['h'], HSL['s'], Math.min(HSL['l'] + 0.1, 1));
	let themecolor_light = rgb2hex(RGB_light['R'],RGB_light['G'],RGB_light['B']);

	document.documentElement.style.setProperty('--themecolor', themecolor);
	document.documentElement.style.setProperty('--themecolor-dark0', themecolor_dark0);
	document.documentElement.style.setProperty('--themecolor-dark', themecolor_dark);
	document.documentElement.style.setProperty('--themecolor-dark2', themecolor_dark2);
	document.documentElement.style.setProperty('--themecolor-dark3', themecolor_dark3);
	document.documentElement.style.setProperty('--themecolor-light', themecolor_light);
	document.documentElement.style.setProperty('--themecolor-rgbstr', themecolor_rgbstr);

	$("meta[name='theme-color']").attr("content", themecolor);
	$("meta[name='theme-color-rgb']").attr("content", themecolor_rgbstr);

	$(window).trigger("scroll");

	if (setcookie){
		setCookie("argon_custom_theme_color", themecolor, 365*24*60*60);
	}
}

/*评论区图片链接点击处理*/
!function(){
	let invid = 0;
	let activeImg = null;
	$(document).on("click" , ".comment-item-text .comment-image" , function(){
		if (!$(this).hasClass("comment-image-preview-zoomed")){
			activeImg = this;
			$(this).addClass("comment-image-preview-zoomed");
			if (!$(this).hasClass("loaded")){
				$(".comment-image-preview", this).attr('src', $(this).attr("data-src"));
			}
			$(".comment-image-preview", this).zoomify('zoomIn');
			if (!$(this).hasClass("loaded")){
				invid = setInterval(function(){
					if (activeImg.width != 0){
						$("html").trigger("scroll");
						console.log($(activeImg).parent());
						$(activeImg).addClass("loaded");
						clearInterval(invid);
						activeImg = null;
					}
				}, 50);
			}
		}else{
			clearInterval(invid);
			activeImg = null;
			$(this).removeClass("comment-image-preview-zoomed");
			$(".comment-image-preview", this).zoomify('zoomOut');
		}
	});
}();