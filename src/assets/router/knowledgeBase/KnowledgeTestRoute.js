import React, { PropTypes } from 'react';
import KnowledgeContent from '../../components/knowledgeBase/common/KnowledgeContent';

import GraphicKnowledgeMain from '../../components/knowledgeBase/graphicKnowledge/GraphicKnowledgeMain';

class KnowledgeTestRoute extends React.Component{	    
    
	render(){
		return(
			<div>
				<GraphicKnowledgeMain></GraphicKnowledgeMain>
			</div>
	    )
	}
}

export default KnowledgeTestRoute;