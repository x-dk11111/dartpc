<?php 
	$reason = $_POST['r'];
	ini_set("auto_detect_line_endings", true);
	if ($reason == 1) {
		$links = file('scores.txt');
		// krsort($links);
		for ($i=0; $i < count($links); $i++) { 
			$scoresArr = explode(',', $links[$i]);
			$scoreName = $scoresArr[0];
			
			$m = 0;
			$scoreSum = 0;
			for ($o=1; $o < count($scoresArr); $o++) { 
				$scoresTmp[$m] = trim($scoresArr[$o]);
				$scoreSum = $scoreSum + $scoresTmp[$m];
				$m++;
			}
			$avg = $scoreSum / count($scoresArr);
			$avg = number_format($avg,2);
			$json[$i] = array("bra" => $scoreName, "avg"=>$avg, "scores" => $scoresTmp);
		}
		echo json_encode($json);
	}
	elseif ($reason == 2) {
		$name = $_POST['name'];
		$file = fopen('scores.txt','a');
		$string = "\n$name";
		for ($i=0; $i < count($_POST['dude']); $i++) { 
			$string = $string.",".$_POST['dude'][$i];
		}
		fwrite($file, "$string");
		fclose($file);
		echo "1";
	}
?>