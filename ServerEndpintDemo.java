import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.json.Json;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value="/connectfive", encoders = {MessageEncoder.class}, decoders = {MessageDecoder.class})
	public class ServerEndpointDemo {
		static Session waiting = null ;
		static List<Pair> pairs = new ArrayList<Pair>();
		
		@OnMessage
	    public void broadcastMessage(Message message, Session session) throws IOException, EncodeException {
	       
	        for(Pair pair: pairs){
				if(pair.getBlack().equals(session)){
					pair.getWhite().getBasicRemote().sendObject(message);
					break;
				} else {
					if( pair.getWhite().equals(session)){
						pair.getBlack().getBasicRemote().sendObject(message);
						break;
					}
				}
			}
	    }		
		
		@OnOpen
	    public void onOpen (Session peer) throws IOException, EncodeException {
			if(waiting == null){
				waiting = peer;
			} else {
				pairs.add(new Pair(waiting, peer));
				//Send start message
				peer.getBasicRemote().sendObject(Json.createObjectBuilder().add("start", "white").build());
				waiting.getBasicRemote().sendObject(Json.createObjectBuilder().add("start", "black").build());
				waiting = null;
			}
	    }
		
		@OnClose
	    public void onClose (Session peer) throws IOException, EncodeException {
			if(waiting!=null && waiting.equals(peer)){
				waiting = null;
			}
			for(Pair pair: pairs){
				if(pair.getBlack().equals(peer)) {
					pair.getWhite().getBasicRemote().sendObject(Json.createObjectBuilder().add("win", "Your opponent left").build());
					pairs.remove(pair);
					break;
				} else {
					if( pair.getWhite().equals(peer)) {
						pair.getBlack().getBasicRemote().sendObject(Json.createObjectBuilder().add("win", "Your opponent left").build());
						pairs.remove(pairs.indexOf(pair));
						break;
					}
				}
			}
	        
	    }
		
		@OnError
		public void handleError(Throwable t){
			t.printStackTrace();
		}
}

	

