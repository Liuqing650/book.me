import React, { PropTypes } from 'react';
import KnowledgeContent from '../../components/knowledgeBase/common/KnowledgeContent';

import SceneKnowledgeMain from '../../components/knowledgeBase/sceneKnowledge/SceneKnowledgeMain';

class SceneKnowledgeMainRouter extends React.Component{	    
    
	render(){
		return(
			<div>
				<SceneKnowledgeMain></SceneKnowledgeMain>
			</div>
	    )
	}
}

export default SceneKnowledgeMainRouter;