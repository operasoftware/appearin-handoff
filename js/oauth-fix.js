var currentUrl = window.location.href;

window.addEventListener('DOMContentLoaded', function() {
	if (currentUrl.match(/^http[s]?:\/\/appengine\.google\.com\/_ah\/loginform(.*)$/i)) {
		findAndReplace('Chrome to Phone', 'Appear.in Handoff', document.body);
	} else if (currentUrl.match(/^http[s]?:\/\/code\.google\.com\/p\/chrometophone\/logo(.*)?$/i)) {
		opera.extension.postMessage({
			'action': 'close_tab'
		});
	}
}, false);

function findAndReplace(searchText, replacement, searchNode) {
	if (!searchText || typeof replacement === 'undefined') {
		return;
	}
	var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText;
	var childNodes = (searchNode || document.body).childNodes;
	var cnLength = childNodes.length;
	var excludes = 'html,head,style,title,link,meta,script,object,iframe';
	while (cnLength--) {
		var currentNode = childNodes[cnLength];
		if (currentNode.nodeType === 1 && (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
			arguments.callee(searchText, replacement, currentNode);
		}
		if (currentNode.nodeType !== 3 || !regex.test(currentNode.data)) {
			continue;
		}
		var parent = currentNode.parentNode;
		var frag = (function() {
			var html = currentNode.data.replace(regex, replacement);
			var wrap = document.createElement('div');
			var frag = document.createDocumentFragment();
			wrap.innerHTML = html;
			while (wrap.firstChild) {
				frag.appendChild(wrap.firstChild);
			}
			return frag;
		}());
		parent.insertBefore(frag, currentNode);
		parent.removeChild(currentNode);
	}
}
