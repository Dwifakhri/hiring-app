/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconButton,
  Modal,
  Box,
  Typography,
  Stack,
  Button,
} from '@mui/material/';
import { X, ChevronRight } from 'react-feather';
import Hand1 from '@/assets/images/hand1.svg';
import Hand2 from '@/assets/images/hand2.svg';
import Hand3 from '@/assets/images/hand3.svg';
import Image from 'next/image';
import Webcam from 'react-webcam';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-core';
import { isPose1, isPose2, isPose3 } from '@/utils/poseLandmark';
import AppLoading from '@/components/AppLoading';
import AppButton from '@/components/AppButton';

export default function ModalProfileCam({
  open,
  onClose,
  onSubmitPhoto,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitPhoto: (photo: string) => void;
}) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [captured, setCaptured] = useState<string | null>(null);
  const [currentPose, setCurrentPose] = useState(1);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleClose = (_event: object, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    onClose();
  };

  // Load the TensorFlow handpose model
  useEffect(() => {
    let active = true;
    const loadModel = async () => {
      await import('@tensorflow/tfjs-backend-webgl');
      await import('@tensorflow/tfjs-core');
      const m = await handpose.load();

      if (!active) return;
      setModel(m);
      setIsLoading(false);
    };
    loadModel();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!model || captured) return;

    let countdownInterval: NodeJS.Timeout | null = null;

    const detect = async () => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      if (
        video.readyState !== 4 ||
        video.videoWidth === 0 ||
        video.videoHeight === 0
      )
        return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Always clear first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const predictions = await model.estimateHands(video);

      if (predictions.length > 0) {
        const hand = predictions[0];
        const lm = hand.landmarks;
        const xs = lm.map((p) => p[0]);
        const ys = lm.map((p) => p[1]);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        let color = 'limegreen';
        let label = `Pose ${currentPose}`;

        const pose1 = isPose1(lm);
        const pose2 = isPose2(lm);
        const pose3 = isPose3(lm);

        // === Pose sequence logic ===
        if (currentPose === 1 && pose1) setCurrentPose(2);
        else if (currentPose === 2 && pose2) setCurrentPose(3);
        else if (currentPose === 3 && pose3) {
          // Start countdown ONCE, independent of hand presence
          if (!countdownInterval && countdown === null) {
            let count = 3;
            setCountdown(count);
            countdownInterval = setInterval(() => {
              count--;
              if (count <= 0) {
                clearInterval(countdownInterval!);
                countdownInterval = null;

                const imageSrc = webcamRef.current?.getScreenshot();
                if (imageSrc) setCaptured(imageSrc);

                setCountdown(null);
                setCurrentPose(1);
              } else {
                setCountdown(count);
              }
            }, 1000);
          }
        } else if (!(pose1 || pose2 || pose3)) {
          color = 'red';
          label = 'Undetected';
        }

        // === Draw detection box and label ===
        ctx.beginPath();
        ctx.rect(minX - 20, minY - 20, maxX - minX + 40, maxY - minY + 40);
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.stroke();

        ctx.font = '18px Nunito Sans';
        const labelWidth = ctx.measureText(label).width + 12;
        ctx.fillStyle = color;
        ctx.fillRect(minX - 20, minY - 40, labelWidth, 26);
        ctx.fillStyle = 'white';
        ctx.fillText(label, minX - 14, minY - 22);
      }

      // Always draw countdown (even if hand not detected)
      if (countdown !== null) {
        ctx.font = '60px bold Nunito Sans';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.textAlign = 'center';
        ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);

        ctx.font = '22px Nunito Sans';
        ctx.fillStyle = 'white';
        ctx.fillText(
          'Capturing photo in...',
          canvas.width / 2,
          canvas.height / 2 + 50
        );
      }
    };

    const interval = setInterval(detect, 150);
    return () => clearInterval(interval);
  }, [model, captured, currentPose, countdown]);

  const retakePhoto = () => {
    setCaptured(null);
    setCurrentPose(1);
    setCountdown(null);
  };

  const submitPhoto = () => {
    if (!captured) return;
    onSubmitPhoto(captured);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 2,
            px: 3,
          }}
        >
          <Box display="flex" flexDirection="column">
            <Typography id="modal-modal-title" fontSize="18px" fontWeight={700}>
              Raise Your Hand to Capture
            </Typography>
            <Typography id="modal-modal-title" fontSize="12px">
              We’ll take the photo once your hand pose is detected.
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <X />
          </IconButton>
        </Box>

        <Box
          display="flex"
          padding="24px"
          alignItems="center"
          flexDirection="column"
          gap="16px"
        >
          <div className="flex flex-col items-center relative w-full">
            {isLoading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={'400px'}
              >
                <AppLoading text="Loading model" size={30} />
              </Box>
            ) : !captured ? (
              <div className="flex flex-col items-center relative w-full">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="object-cover  w-full h-[400px]"
                  videoConstraints={{ facingMode: 'user' }}
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0" />
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="16px"
                  alignItems="center"
                  mt={2}
                >
                  <Typography variant="subtitle2" fontWeight={400}>
                    To take a picture, follow the hand poses in the order shown
                    below. The system will automatically capture the image once
                    the final pose is detected.
                  </Typography>

                  <Stack direction="row" alignItems="center" gap={1}>
                    <Image src={Hand1} alt="hand1" loading="lazy" />
                    <ChevronRight />
                    <Image src={Hand2} alt="hand2" loading="lazy" />
                    <ChevronRight />
                    <Image src={Hand3} alt="hand3" loading="lazy" />
                  </Stack>
                </Box>
              </div>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                gap="16px"
              >
                <img src={captured} alt="captured" loading="lazy" />
                <Box display="flex" gap="16px" flexDirection="row">
                  <Button
                    onClick={retakePhoto}
                    variant="outlined"
                    color="info"
                    sx={{
                      width: 'fit-content',
                      borderRadius: '8px',
                      boxShadow: '0px 1px 2px 0px #0000001F',
                      borderColor: 'divider',
                      textTransform: 'none',
                      p: '4px 16px',
                      fontWeight: 700,
                    }}
                  >
                    Retake photo
                  </Button>
                  <AppButton
                    label="Submit"
                    onClick={submitPhoto}
                    fullWidth={false}
                  />
                </Box>
              </Box>
            )}
          </div>
        </Box>
      </Box>
    </Modal>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 637,
  height: 641,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 0,
  p: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};
