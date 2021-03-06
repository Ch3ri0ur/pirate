// import { ReactComponent } from '*.svg';
import React, { useEffect, useState } from 'react';
import { useStore } from 'react-hookstore';
import Janus, { JanusJS } from './janus';
import { Row, Col, Button, Space } from 'antd';

let janus: Janus;
let streaming: JanusJS.PluginHandle;
const opaqueId = 'streamingtest-' + Janus.randomString(12);

const selectedStream = 10;

const videoPlayerRef: React.RefObject<HTMLVideoElement> = React.createRef();

Janus.init({
    debug: 'all',
    callback: () => {
        console.log('Janus now initialized');
    },
});

const startSession = (server: string) => {
    if (!Janus.isWebrtcSupported()) {
        alert('No WebRTC support... ');
        return;
    }
    console.log('starting janus');
    // Create session
    janus = new Janus({
        server: server,
        success: function () {
            // Attach to Streaming plugin
            janus.attach({
                plugin: 'janus.plugin.streaming',
                opaqueId: opaqueId,
                success: function (pluginHandle) {
                    console.log('starting janus');
                    streaming = pluginHandle;
                    Janus.log('Plugin attached! (' + streaming.getPlugin() + ', id=' + streaming.getId() + ')');
                },
                error: function (error) {
                    Janus.error('  -- Error attaching plugin... ', error);
                    alert('Error attaching plugin... ' + error);
                },
                iceState: function (state) {
                    Janus.log('ICE state changed to ' + state);
                },
                webrtcState: function (on) {
                    Janus.log('Janus says our WebRTC PeerConnection is ' + (on ? 'up' : 'down') + ' now');
                },
                onmessage: function (msg, jsep) {
                    Janus.debug(' ::: Got a message :::', msg);
                    const result = msg['result'];
                    if (result) {
                        if (result['status']) {
                            const status = result['status'];
                            // if (status === "starting") $("#status").removeClass("hide").text("Starting, please wait...").show();
                            // else if (status === "started") $("#status").removeClass("hide").text("Started").show();
                            // else if (status === "stopped") stopStream();
                            if (status === 'stopped') stopStream();
                        }
                    } else if (msg['error']) {
                        alert(msg['error']);
                        stopStream();
                        return;
                    }
                    if (jsep && jsep.sdp) {
                        Janus.debug('Handling SDP as well...', jsep);
                        const stereo = jsep.sdp.indexOf('stereo=1') !== -1;
                        // Offer from the plugin, let's answery
                        streaming.createAnswer({
                            jsep: jsep,
                            // We want recvonly audio/video and, if negotiated, datachannels
                            media: { audioSend: false, videoSend: false, data: true },
                            customizeSdp: function (jsep: JanusJS.JSEP) {
                                if (jsep && jsep.sdp) {
                                    if (stereo && jsep.sdp.indexOf('stereo=1') === -1) {
                                        // Make sure that our offer contains stereo too
                                        jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;stereo=1');
                                    }
                                }
                            },
                            success: function (jsep: JanusJS.JSEP) {
                                Janus.debug('Got SDP!', jsep);
                                const body = { request: 'start' };
                                streaming.send({ message: body, jsep: jsep });
                                // $("#watch").html("Stop").removeAttr("disabled").click(stopStream);
                            },
                            error: function (error: any) {
                                Janus.error('WebRTC error:', error);
                                alert('WebRTC error... ' + error.message);
                            },
                        });
                    }
                },
                onremotestream: function (stream) {
                    Janus.debug(' ::: Got a remote stream :::', stream);
                    console.log('player ref');
                    console.log(videoPlayerRef);
                    if (videoPlayerRef.current) {
                        Janus.attachMediaStream(videoPlayerRef.current, stream);
                    }
                },
                ondataopen: function (data: any) {
                    Janus.log('The DataChannel is available!');
                },
                ondata: function (data: any) {
                    Janus.debug('We got data from the DataChannel!', data);
                },
                oncleanup: function () {
                    Janus.log(' ::: Got a cleanup notification :::');
                },
            });
        },
        error: function (error) {
            Janus.error(error);
        },
        destroyed: function () {
            console.log('destroyed');
        },
    });
};

const stopSession = () => {
    console.log('stopSession');
    janus.destroy();
};

function startStream() {
    Janus.log('Selected video id #' + selectedStream);
    console.log('started stream');
    if (!selectedStream) {
        alert('Janus is not configured to show the correct stream id');
        return;
    }
    const body = {
        request: 'watch',
        id: selectedStream,
    };
    streaming.send({ message: body });
    console.log('set stream request');
}

function stopStream() {
    // $("#watch").attr("disabled", true).unbind("click");
    console.log('stopStream');

    // TODO check if streaming is a session/has send/hangup  -> got cannot read property "send" of undefined when no connection could be made and i tried to disconnect
    // TODO find similar errors
    // TODO propperly track if there is a session or not, dont assume and not react to errors
    const body = { request: 'stop' };
    streaming.send({ message: body });
    streaming.hangup();
}

interface Props {
    children?: React.ReactChild;
}

const VideoStream = (props: Props) => {
    const targetUrl = useStore<string>('ProjectTargetURL')[0];
    const [haveSession, setHaveSession] = useState(false);
    const [streaming, setStreaming] = useState(false);
    useEffect(() => {
        console.log('Effect');
        startSessionHandler();

        console.log(Janus);
        return () => {
            console.log('cleanup');
            stopSessionHandler();
        };
    }, []);

    function startSessionHandler() {
        startSession(targetUrl + '/janus');
        setHaveSession(true);
    }

    function stopSessionHandler() {
        stopSession();
        setHaveSession(false);
        setStreaming(false);
    }

    function startStreamHandler() {
        startStream();
        setStreaming(true);
    }

    function stopStreamHandler() {
        stopStream();
        setStreaming(false);
    }

    // TODO investigate stuttering / glitches / reconnects
    // TODO set a good size for video/ have something inplace with same size do prevent layout shifts when starting
    // TODO investigate why ice doesn't work without 1-1 nat mapping
    // TODO think about making buttons more clear or starting automatically? perhaps thats not optimal

    return (
        <div>
            <Row>
                <Col span={12}>
                    <Space>
                        <Button type="primary" disabled={haveSession} onClick={startSessionHandler}>
                            Start
                        </Button>
                        <Button type="primary" danger disabled={!haveSession} onClick={stopSessionHandler}>
                            stop
                        </Button>
                        <Button type="primary" disabled={!haveSession || streaming} onClick={startStreamHandler}>
                            StartStream
                        </Button>
                        <Button type="primary" danger disabled={!haveSession || !streaming} onClick={stopStreamHandler}>
                            StopStream
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Row>
                <Col>
                    {haveSession ? (
                        <video style={{ width: '100%' }} id="remotevideo" ref={videoPlayerRef} autoPlay playsInline />
                    ) : (
                        <div>
                            <p>No Connection</p>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default VideoStream;
